import React from 'react';

const HandDrawnCircle = ({ className }) => {
    return (
        <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
            <svg
                viewBox="0 0 200 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <ellipse
                    cx="100" cy="50" rx="95" ry="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ strokeDasharray: '2 0' }}
                />
                <ellipse
                    cx="100" cy="50" rx="93" ry="43"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.3"
                    transform="rotate(2 100 50)"
                />
            </svg>
        </div>
    );
};

export default HandDrawnCircle;
