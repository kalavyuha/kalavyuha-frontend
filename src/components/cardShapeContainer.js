import React from 'react';
import { Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface AppointmentCardProps {
  title: string;
  value: number;
  percentage: number;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ title, value, percentage }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        <button className="more-options">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
              fill="#757575"
            />
          </svg>
        </button>
      </div>

      <div className="card-content">
        <span className="value">{value.toLocaleString()}</span>
        <Box
          component="span"
          className="percentage"
          sx={{
            backgroundColor: percentage > 0 ? '#e6f4ea' : '#fce8e6',
            color: percentage > 0 ? '#137333' : '#c5221f',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {percentage > 0 ? (
            <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
          ) : (
            <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
          )}
          {Math.abs(percentage)}%
        </Box>
      </div>

      <style jsx>{`
        .card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
          padding: 16px;
          max-width: 300px;
          font-family: Arial, sans-serif;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .card-title {
          color: #757575;
          font-size: 14px;
        }
        .more-options {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .card-content {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .value {
          font-size: 28px;
          font-weight: bold;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default AppointmentCard;
