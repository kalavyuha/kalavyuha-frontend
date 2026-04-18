export const transformBusiness = (data) => ({
  business_type: data.businessRole?.toLowerCase(),
  business_name: data.formData.businessName,

  profile_image: data.formData.profilePicture?.s3Url?.url || null,
  cover_image: data.formData.coverImage?.s3Url?.url || null,

  description: data.formData.introduction || null,

  gender_preference: data.formData.genderPreference?.toLowerCase() || "any",

  website: data.formData.website || null,

  locations: [
    {
      latitude: parseFloat(data.formData.adrsLatitude) || null,
      longitude: parseFloat(data.formData.adrsLongitude) || null,

      shop_number: data.formData.shopNumber || null,
      street_address: data.formData.streetAddress,

      city: data.formData.city || null,
      state: data.formData.state || null,
      country: data.formData.country || null,

      zip_code: data.formData.zipCode
    }
  ]
});