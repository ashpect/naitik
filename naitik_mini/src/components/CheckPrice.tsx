import { useState,useEffect } from "react";
import Card from "./card";
import tag from "../Tag.png";
import Chart from "chart.js/auto";

interface PriceData {
  date: string;
  price: number;
}

interface ChartData {
  flipkart: PriceData[];
  amazon: PriceData[];
}

function CheckPrice() {
  function generateFakeData(): ChartData {
  
    return {
      "flipkart": [
          {"price": 71999, "date": "03-23-2023"},
          {"price": 71999, "date": "04-24-2023"},
          {"price": 79990, "date": "05-10-2023"},
          {"price": 67999, "date": "06-08-2023"},
          {"price": 70999, "date": "07-06-2023"},
          {"price": 79990, "date": "08-09-2023"},
          {"price": 67999, "date": "09-08-2023"},
          {"price": 56999, "date": "10-07-2023"},
          {"price": 61999, "date": "11-16-2023"},
          {"price": 61999, "date": "12-16-2023"},
          {"price": 69999, "date": "01-12-2024"},
          {"price": 54999, "date": "02-13-2024"}
      ],
      "amazon": [
          {"price": 90999, "date": "03-23-2023"},
          {"price": 71999, "date": "04-24-2023"},
          {"price": 69900, "date": "05-10-2023"},
          {"price": 68999, "date": "06-08-2023"},
          {"price": 69999, "date": "07-06-2023"},
          {"price": 69990, "date": "08-09-2023"},
          {"price": 63999, "date": "09-08-2023"},
          {"price": 74990, "date": "10-07-2023"},
          {"price": 72999, "date": "11-16-2023"},
          {"price": 72999, "date": "12-16-2023"},
          {"price": 72999, "date": "01-12-2024"},
          {"price": 56999, "date": "02-13-2024"}
      ]
  }
  
  }
  
  const [chartData, setChartData] = useState<ChartData | null>(null);
  useEffect(() => {
    if (chartData) {
      renderChart();
    }
  }, [chartData]);
  const handleClick = async () => {
    // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id!},
    //   func: async () => {
    //     const apiUrl = 'http://127.0.0.1:5000/search';
  
    //     try {
    //       const response = await fetch(apiUrl);
  
    //       if (!response.ok) {
    //         throw new Error(`API request failed with status: ${response.status}`);
    //       }
  
    //       const responseData: ChartData = await response.json();
    //       console.log(responseData);
    //       chrome.storage.local.set({ "data": JSON.stringify(responseData) });
    //       setChartData(responseData); // Set the chart data
    //     } catch (error) {
    //       console.error('Error making API request:', error);
    //     }
    setChartData(generateFakeData)
    //   },
    // });
  };

  const closeAnalysis = () =>{
    setChartData(null)
  }
  const renderChart = () => {
    if (!chartData) return;
  
    const months = ["March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February"];
    const uniqueMonths = Array.from(new Set(chartData.flipkart.map(entry => months[new Date(entry.date).getMonth()])));
    const sortedMonths = months.filter(month => uniqueMonths.includes(month)); // Ensure all months are present and in the correct order
    const dates = sortedMonths.map(month => month); // Keep only one data point per month
  
    const flipkartPrices = sortedMonths.map(month => {
      const entry = chartData.flipkart.find(data => months[new Date(data.date).getMonth()] === month);
      return entry ? entry.price : null;
    });
    const amazonPrices = sortedMonths.map(month => {
      const entry = chartData.amazon.find(data => months[new Date(data.date).getMonth()] === month);
      return entry ? entry.price : null;
    });
  
    const ctx = document.getElementById("lineChart") as HTMLCanvasElement;
    ctx.width = 600; 
    ctx.height = 400; 
    new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Flipkart",
            data: flipkartPrices,
            fill: false,
            borderColor: "#B692F6",
            tension: 0.1,
          },
          {
            label: "Amazon",
            data: amazonPrices,
            fill: false,
            borderColor: "#53389E",
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          xAxis: {
            ticks: {
              autoSkip: false, 
              maxRotation: 0, 
              callback: function(value) {
                return value; 
              }
            }
          }
        }
      }
    });
  };
  
  


  return (
    (
      <>
        {chartData ? (
          <div className="card">
            <h1>1 Year tracking of IPhone 14 (Midnight, 128GB)</h1>
            <canvas id="lineChart"></canvas>
            <button className="secondary-button" onClick={closeAnalysis} style={{cursor:"pointer"}}>Close Analysis</button>
          </div>
        ) : (
          <Card
            heading="Check special price validity"
            primaryButton="Check validity"
            content="This website claims limited time special price offer."
            imageSrc={tag}
            onPrimaryButtonClick={handleClick}
          />
        )}
      </>
    )
  );
}

export default CheckPrice;
