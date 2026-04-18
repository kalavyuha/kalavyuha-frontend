import { createBusiness } from "../api/business.api";
import { createStaffApi} from "../api/staff.api";
import { createCategoryApi, createServiceApi, assignStaffToServiceApi} from "../api/services.api";
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
  "Certification": "certification",
};

const REQUIRED_DOCUMENTS = [
  "Pan Card (Owner)",
  "GST Certificate",
  "Utility Bills",
];

export const createBusinessFlow = async (
  data,
  files,
  token,
  onProgress
) => {
  try {

    const missingDocs = REQUIRED_DOCUMENTS.filter(
      (doc) => !files?.[doc] || files[doc].length === 0
    );

    if (missingDocs.length > 0) {
      throw new Error(
        `Missing required documents: ${missingDocs.join(", ")}`
      );
    }

    onProgress(10, "Creating business...");
    const businessResponse = await createBusiness(
      transformBusiness(data),
      token
    );
    const businessId = businessResponse.data.id;

    onProgress(30, "Creating staff...");
    let createdStaff = [];
    const staffMap = new Map();
    
    if (data.teamMembers?.length) {
      const staffPayload = transformStaff(data.teamMembers);
      createdStaff = await createStaffApi(staffPayload, token);
      
      if (Array.isArray(createdStaff)) {
        createdStaff.forEach((staff, index) => {
          const originalMember = data.teamMembers[index];
          if (originalMember) {
            staffMap.set(originalMember.name, staff.id);
          }
          staffMap.set(staff.name, staff.id);
        });
      } else {
        data.teamMembers.forEach(member => {
          if (member.id) {
            staffMap.set(member.name, member.id);
          }
        });
      }
    }

    // Step 3: Create Services (30% - 70%)
    if (data.services?.length) {
      const transformedServices = transformServices(data.services);
      
      let totalApiCalls = 0;
      transformedServices.forEach(cat => {
        totalApiCalls += 1;
        totalApiCalls += cat.services.length; 
        cat.services.forEach(service => {
          if (service.assigned_staff?.length > 0) {
            totalApiCalls += 1; 
          }
        });
      });
      
      let completedCalls = 0;
      const BASE_PROGRESS = 30;
      const MAX_PROGRESS = 70;
      const PROGRESS_RANGE = MAX_PROGRESS - BASE_PROGRESS; // 40% range
      
      for (const categoryData of transformedServices) {

        // Create category
        completedCalls++;
        const categoryProgress = BASE_PROGRESS + (completedCalls / totalApiCalls) * PROGRESS_RANGE;
        onProgress(Math.round(categoryProgress), `Creating category: ${categoryData.category?.name}...`);


        const categoryResponse = await createCategoryApi(
          {
            name: categoryData.category?.name,
            expanded: categoryData.category?.expanded ?? true
          },
          token
        );
        
        const categoryId = categoryResponse.data.id;
        const validServices = (categoryData.services || []).filter(
          (s) => s.name && s.name.trim() !== ""
        );
        
        // Create services under this category
        for (const serviceData of validServices) {
          completedCalls++;
          const serviceProgress = BASE_PROGRESS + (completedCalls / totalApiCalls) * PROGRESS_RANGE;
          onProgress(Math.round(serviceProgress), `Creating service: ${serviceData.name}...`);
          
          // Map staff names to IDs
          const staffIds = (serviceData.staff || [])
            .map(staffName => staffMap.get(staffName))
            .filter(Boolean);
          
          const servicePayload = {
            category_id: categoryId,
            name: serviceData.name,
            description: serviceData.description || "",
            duration: parseInt(serviceData.duration) || 30,
            duration_type: serviceData.duration_type || "minutes",
            image: serviceData.image || null,
            uploaded: serviceData.uploaded || false,
            online_booking_enabled: serviceData.online_booking_enabled ?? false,
            pricing: {
              price: parseFloat(serviceData.pricing?.price) || 0,
              effective_from: serviceData.pricing?.effective_from || new Date().toISOString(),
              effective_to: serviceData.pricing?.effective_to || null
            }
          };


          
          const serviceResponse = await createServiceApi(servicePayload, token);
          
          const serviceId = serviceResponse.data.id;
          
          // Assign staff to service if any
          if (staffIds.length > 0) {
            completedCalls++;
            const assignProgress = BASE_PROGRESS + (completedCalls / totalApiCalls) * PROGRESS_RANGE;
            onProgress(Math.round(assignProgress), `Assigning staff to ${serviceData.name}...`);
            await assignStaffToServiceApi(serviceId, staffIds, token);
          }
        }
      }
      
      onProgress(70, "Services created successfully...");
    } else {
      onProgress(70, "No services to create...");
    }

    onProgress(70, "Setting up business hours...");
    if (data.businessHours) {
      const hoursPayloads = transformHours(data.businessHours);

      await Promise.all(
        hoursPayloads.map((payload) =>
          createHoursApi(payload, token)
        )
      );
    }

    onProgress(85, "Business hours configured...");

    onProgress(85, "Uploading documents...");
    if (files && Object.keys(files).length > 0) {
      const uploadPromises = [];

      for (const [docName, fileArray] of Object.entries(files)) {
        const document_type = DOCUMENT_TYPE_MAP[docName];
        
        if (!document_type) continue;

        for (const fileItem of fileArray) {
          const fileObj = fileItem.originFileObj || fileItem;

          if (!(fileObj instanceof File)) continue;

          const formData = new FormData();
          formData.append("document_type", document_type);
          formData.append("file", fileObj);

          if (fileItem.expiryDate) {
            formData.append("expiry_date", new Date(fileItem.expiryDate).toISOString());
          }

          uploadPromises.push(uploadDocumentApi(formData, token));
        }
      }

      onProgress(92, "Processing documents...");

      await Promise.all(uploadPromises);
    }
    
    onProgress(100, "Business setup completed successfully!");

    return businessId;

  } catch (error) {
    console.error("Error in business creation flow:", error);
    throw error;
  }
};