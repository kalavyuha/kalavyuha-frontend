import { createBusiness } from "../api/business.api";
import { createStaffApi } from "../api/staff.api";
import {
  createCategoryApi,
  createServiceApi,
  assignStaffToServiceApi,
} from "../api/services.api";
import { createHoursApi } from "../api/hours.api";
import { uploadDocumentApi } from "../api/documents.api";

import { transformBusiness } from "../transformers/business.transformer";
import { transformStaff } from "../transformers/staff.transformer";
import { transformServices } from "../transformers/services.transformer";
import { transformHours } from "../transformers/hours.transformer";

const DOCUMENT_TYPE_MAP = {
  "Pan Card (Owner)": "owner_id",
  "GST Certificate": "tax_id",
  "Business License": "business_license",
  "Utility Bills": "address_proof",
  "Medical License": "medical_license",
  Certification: "certification",
};

const REQUIRED_DOCUMENTS = [
  "Pan Card (Owner)",
  "GST Certificate",
  "Utility Bills",
];

/* Sleep Utility */
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isAlreadyExistsError = (error) => {
  const message = String(error?.message || "").toLowerCase();

  return (
    error?.status === 409 ||
    /already exist|already exists|duplicate|conflict/i.test(
      message
    )
  );
};

const createFlowError = (step, error) => ({
  step,
  message: error?.message || "Unknown error",
  status: error?.status,
  details: error?.response || null,
});

/* Flow Runner */
const runFlowStep = async (
  fn,
  stepDescription,
  errors,
  options = {}
) => {
  const {
    successDelay = 700,
    errorDelay = 400,
  } = options;

  try {
    const result = await fn();

    await sleep(successDelay);

    return result;
  } catch (error) {
    await sleep(errorDelay);

    if (isAlreadyExistsError(error)) {
      console.warn(
        `${stepDescription} already exists, skipping.`,
        error
      );

      return error.response ?? null;
    }

    errors.push(createFlowError(stepDescription, error));

    return null;
  }
};

export const createBusinessFlow = async (
  data,
  files,
  token,
  onProgress
) => {
  try {
    const errors = [];

    /* Validate Required Documents */
    const missingDocs = REQUIRED_DOCUMENTS.filter(
      (doc) => !files?.[doc] || files[doc].length === 0
    );

    if (missingDocs.length > 0) {
      throw new Error(
        `Missing required documents: ${missingDocs.join(
          ", "
        )}`
      );
    }

    /* Step 1: Create Business */
    onProgress(10, "Creating business...");

    const businessResponse = await runFlowStep(
      () => createBusiness(transformBusiness(data), token),
      "Create business",
      errors,
      {
        successDelay: 1200,
      }
    );

    const businessId =
      businessResponse?.data?.id ?? null;

    /* Step 2: Create Staff */
    onProgress(25, "Creating staff...");

    let createdStaff = [];
    const staffMap = new Map();

    if (data.teamMembers?.length) {
      const staffPayload = transformStaff(
        data.teamMembers
      );

      const staffResponse = await runFlowStep(
        () => createStaffApi(staffPayload, token),
        "Create staff",
        errors,
        {
          successDelay: 900,
        }
      );

      createdStaff = Array.isArray(staffResponse)
        ? staffResponse
        : [];

      if (createdStaff.length > 0) {
        createdStaff.forEach((staff, index) => {
          const originalMember =
            data.teamMembers[index];

          if (originalMember) {
            staffMap.set(
              originalMember.name,
              staff.id
            );
          }

          staffMap.set(staff.name, staff.id);
        });
      } else {
        data.teamMembers.forEach((member) => {
          if (member.id) {
            staffMap.set(member.name, member.id);
          }
        });
      }
    }

    /* Step 3: Create Services */
    if (data.services?.length) {
      const transformedServices =
        transformServices(data.services);

      let totalApiCalls = 0;

      transformedServices.forEach((cat) => {
        totalApiCalls += 1;

        totalApiCalls += cat.services.length;

        cat.services.forEach((service) => {
          if (
            service.assigned_staff?.length > 0
          ) {
            totalApiCalls += 1;
          }
        });
      });

      let completedCalls = 0;

      const BASE_PROGRESS = 30;
      const MAX_PROGRESS = 70;
      const PROGRESS_RANGE =
        MAX_PROGRESS - BASE_PROGRESS;

      for (const categoryData of transformedServices) {
        completedCalls++;

        const categoryProgress =
          BASE_PROGRESS +
          (completedCalls / totalApiCalls) *
            PROGRESS_RANGE;

        onProgress(
          Math.round(categoryProgress),
          `Creating category: ${categoryData.category?.name}...`
        );

        const categoryResponse =
          await runFlowStep(
            () =>
              createCategoryApi(
                {
                  name:
                    categoryData.category?.name,
                  expanded:
                    categoryData.category
                      ?.expanded ?? true,
                },
                token
              ),
            `Create category: ${categoryData.category?.name}`,
            errors,
            {
              successDelay: 700,
            }
          );

        const categoryId =
          categoryResponse?.data?.id;

        if (!categoryId) {
          console.warn(
            `Skipping services for category "${categoryData.category?.name}"`
          );

          continue;
        }

        const validServices = (
          categoryData.services || []
        ).filter(
          (s) => s.name && s.name.trim() !== ""
        );

        for (const serviceData of validServices) {
          completedCalls++;

          const serviceProgress =
            BASE_PROGRESS +
            (completedCalls / totalApiCalls) *
              PROGRESS_RANGE;

          onProgress(
            Math.round(serviceProgress),
            `Creating service: ${serviceData.name}...`
          );

          const staffIds = (
            serviceData.staff || []
          )
            .map((staffName) =>
              staffMap.get(staffName)
            )
            .filter(Boolean);

          const servicePayload = {
            category_id: categoryId,
            name: serviceData.name,
            description:
              serviceData.description || "",
            duration:
              parseInt(serviceData.duration) ||
              30,
            duration_type:
              serviceData.duration_type ||
              "minutes",
            image: serviceData.image || null,
            uploaded:
              serviceData.uploaded || false,
            online_booking_enabled:
              serviceData.online_booking_enabled ??
              false,

            pricing: {
              price:
                parseFloat(
                  serviceData.pricing?.price
                ) || 0,

              effective_from:
                serviceData.pricing
                  ?.effective_from ||
                new Date().toISOString(),

              effective_to:
                serviceData.pricing
                  ?.effective_to || null,
            },
          };

          const serviceResponse =
            await runFlowStep(
              () =>
                createServiceApi(
                  servicePayload,
                  token
                ),
              `Create service: ${serviceData.name}`,
              errors,
              {
                successDelay: 700,
              }
            );

          const serviceId =
            serviceResponse?.data?.id;

          if (!serviceId) {
            console.warn(
              `Skipping staff assignment for service "${serviceData.name}"`
            );

            continue;
          }

          if (staffIds.length > 0) {
            completedCalls++;

            const assignProgress =
              BASE_PROGRESS +
              (completedCalls /
                totalApiCalls) *
                PROGRESS_RANGE;

            onProgress(
              Math.round(assignProgress),
              `Assigning staff to ${serviceData.name}...`
            );

            await runFlowStep(
              () =>
                assignStaffToServiceApi(
                  serviceId,
                  staffIds,
                  token
                ),
              `Assign staff to ${serviceData.name}`,
              errors,
              {
                successDelay: 600,
              }
            );
          }
        }
      }

      onProgress(
        70,
        "Services created successfully..."
      );

      await sleep(800);
    } else {
      onProgress(70, "No services to create...");
      await sleep(600);
    }

    /* Step 4: Business Hours */
    onProgress(
      75,
      "Setting up business hours..."
    );

    if (data.businessHours) {
      const hoursPayloads = transformHours(
        data.businessHours
      );

      await Promise.all(
        hoursPayloads.map((payload) =>
          runFlowStep(
            () =>
              createHoursApi(payload, token),
            "Create business hours",
            errors,
            {
              successDelay: 500,
            }
          )
        )
      );
    }

    await sleep(800);

    onProgress(
      85,
      "Business hours configured..."
    );

    /* Step 5: Upload Documents */
    onProgress(88, "Uploading documents...");

    if (
      files &&
      Object.keys(files).length > 0
    ) {
      const uploadPromises = [];

      for (const [
        docName,
        fileArray,
      ] of Object.entries(files)) {
        const document_type =
          DOCUMENT_TYPE_MAP[docName];

        if (!document_type) continue;

        for (const fileItem of fileArray) {
          const fileObj =
            fileItem.originFileObj || fileItem;

          if (!(fileObj instanceof File))
            continue;

          const formData = new FormData();

          formData.append(
            "document_type",
            document_type
          );

          formData.append("file", fileObj);

          if (fileItem.expiryDate) {
            formData.append(
              "expiry_date",
              new Date(
                fileItem.expiryDate
              ).toISOString()
            );
          }

          uploadPromises.push(
            runFlowStep(
              () =>
                uploadDocumentApi(
                  formData,
                  token
                ),
              `Upload document: ${docName}`,
              errors,
              {
                successDelay: 500,
              }
            )
          );
        }
      }

      onProgress(
        95,
        "Processing uploaded documents..."
      );

      await Promise.all(uploadPromises);
    }

    await sleep(1200);

    onProgress(
      100,
      "Business setup completed successfully!"
    );

    return {
      status:
        errors.length > 0
          ? "partial"
          : "success",

      businessId,
      errors,
    };
  } catch (error) {
    console.error(
      "Error in business creation flow:",
      error
    );

    throw error;
  }
};