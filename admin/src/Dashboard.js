import React, { useEffect, useState } from 'react';
import Card from './card'; 
import { HStack, VStack } from '@chakra-ui/react'; 
import Navbar from './navbar'; 
import patterns from './patterns.png';
import pending from './pending.png';
import report from './report.png';
import resolve from './resolve.png';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";


function Dashboard() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-25');
    const minReports = 2000;
    const maxReports = 10000;

    function generateRandomData(startDate, endDate, minReports, maxReports) {
      function generateRandomNumberOfReports() {
        return Math.floor(Math.random() * (maxReports - minReports + 1)) + minReports;
      }
  
      let currentDate = new Date(startDate);
      const data = [];
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const numberOfReports = generateRandomNumberOfReports();
        data.push({ date: dateString, number_of_reports: numberOfReports });
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
  
      return data;
    }

    const data = generateRandomData(startDate, endDate, minReports, maxReports);
    setChartData(data);
  }, []);

  const dashboardStyle = {
    textAlign: 'left',
    color: '#000',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    alignSelf: 'left',
    marginLeft:"4rem",
    marginTop:"2rem"
  };

  return (
    <VStack align="stretch" >
      <Navbar />
      <div style={dashboardStyle}>Dashboard</div>
      <HStack spacing={4} align="stretch" ml="4rem" mt="2rem" justifyContent="space-between" mr="4rem">
        <Card
          heading="No. of Reports"
          number={40689}
          percentage={8.5}
          icon={report}
        />
        <Card
          heading="Total Patterns"
          number={10293}
          percentage={1.3}
          icon={patterns}
        />
        <Card
          heading="Patterns Resolved"
          number={89000}
          percentage={-4.3}
          icon={resolve}
        />
        <Card
          heading="Patterns Pending"
          number={2040}
          percentage={8.5}
          icon={pending}
        />
      </HStack>
      <div style={dashboardStyle}>Total Reports</div>
      {chartData.length > 0 && (
        <div style={{height:"40rem", margin:"4rem",display:"flex",alignItems:"center", justifyContent:"center"}}>
   <Line
   data={{
     labels: chartData.map(entry => entry.date),
     datasets: Object.keys(chartData[0]).filter(key => key !== 'date').map(category => ({
       label: category,
       data: chartData.map(entry => entry[category]),
     })),
   }}
 />
 </div>
    )}
    </VStack>
  );
}

export default Dashboard;
