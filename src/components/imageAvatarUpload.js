// UploadImageAvatar.js

const UploadImageAvatar = ({ handleImageUpload, handleAvatarSelect, handleCancel, isDragging, handleDragOver, handleDragLeave, handleDrop, selectedImage, handleSave }) => {
  return (
    <Dialog open={isUploadOpen} onClose={handleCloseUpload} sx={{ height: "100" }} PaperProps={{ sx: { borderRadius: '16px' } }}>
      <Box sx={{ height: '100%', alignContent: 'center', borderRadius: '18px' }}>
        <Card sx={{ maxWidth: 400, margin: 'auto', borderRadius: '18px', p: 1 }}>
          <CardHeader
            title="Upload Your Profile Image:"
            titleTypographyProps={{ fontWeight: 'bold', fontSize: '1.3rem' }}
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: '6px' }}>
            {/* ...existing code... */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Grid container sx={{ justifyContent: 'space-between' }}>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderRadius: '24px',
                      color: 'black',
                      textTransform: 'none',
                      borderColor: '#d9d9d9',
                      background: '#fbfbfb',
                    }}
                    onClick={handleCancel}
                  >
                    <b>Cancel</b>
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '24px',
                      bgcolor: 'black',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                    }}
                    onClick={handleSave} // Call handleSave on button click
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Dialog>
  );
};

export default UploadImageAvatar;
