// components/LineChart.js
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import ChartType if available

interface LineChartProps {
  chartData: any;
  id: string;
}

const LineChart: React.FC<LineChartProps> = ({ chartData, id }) => {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const canvas = document.getElementById(id) as HTMLCanvasElement; // Use type assertion for canvas
    const ctx = canvas.getContext('2d'); // Use getContext on the canvas element
    chartRef.current = new Chart(ctx!, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Год'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: id
            }
          }
        }
      }
    });
  }, [chartData]);

  return (
    <div className="chart-container">
      <div className="border border-gray-400 p-4 h-96">
        <canvas id={id}></canvas>
      </div>
    </div>
  );
}

export default LineChart;