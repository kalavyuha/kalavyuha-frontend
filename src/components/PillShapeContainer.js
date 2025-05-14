const PillShapeContainer = ({ src, alt, width = '300px', height = '150px', children }) => {
    return (
      <div
        style={{
          width: width,
          height: height,
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <img 
            src={src} 
            alt={alt}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(27, 77, 105, 0.53)',
            }}
          />
        </div>
        {children && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {children}
          </div>
        )}
      </div>
    );
  };

export default PillShapeContainer;