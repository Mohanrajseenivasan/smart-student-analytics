import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Charts = ({ students }) => {
    const [riskDistribution, setRiskDistribution] = useState({});
    const [gradeDistribution, setGradeDistribution] = useState({});

    useEffect(() => {
        if (students && students.length > 0) {
            calculateDistributions();
        }
    }, [students]);

    const calculateDistributions = () => {
        // Risk distribution
        const risks = { excellent: 0, good: 0, average: 0, 'at-risk': 0, critical: 0 };
        const grades = { 'A (90-100)': 0, 'B (80-89)': 0, 'C (70-79)': 0, 'D/F (<70)': 0 };

        students.forEach((student) => {
            if (student.behaviorData) {
                const riskClass = student.behaviorData.behaviorClass;
                if (risks.hasOwnProperty(riskClass)) {
                    risks[riskClass]++;
                }

                const grade = student.behaviorData.gradeAverage;
                if (grade >= 90) grades['A (90-100)']++;
                else if (grade >= 80) grades['B (80-89)']++;
                else if (grade >= 70) grades['C (70-79)']++;
                else grades['D/F (<70)']++;
            }
        });

        setRiskDistribution(risks);
        setGradeDistribution(grades);
    };

    const riskChartData = {
        labels: Object.keys(riskDistribution),
        datasets: [
            {
                label: 'Number of Students',
                data: Object.values(riskDistribution),
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#fd7e14',
                    '#dc3545',
                ],
            },
        ],
    };

    const gradeChartData = {
        labels: Object.keys(gradeDistribution),
        datasets: [
            {
                label: 'Number of Students',
                data: Object.values(gradeDistribution),
                backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="charts-container">
            <div className="chart-card">
                <h3>Risk Level Distribution</h3>
                <div className="chart-wrapper" style={{ height: '300px' }}>
                    <Pie data={riskChartData} options={chartOptions} />
                </div>
            </div>

            <div className="chart-card">
                <h3>Grade Distribution</h3>
                <div className="chart-wrapper" style={{ height: '300px' }}>
                    <Bar data={gradeChartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Charts;
