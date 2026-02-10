import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
    return (
        <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-icon" style={{ background: `${color}20` }}>
                <span>{icon}</span>
            </div>
            <div className="stat-content">
                <h3>{title}</h3>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );
};

export default StatsCard;
