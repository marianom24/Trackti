import {React, useState, useEffect} from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import api from './api.js'

const fetchStats = async()=>{
  const response = await api.get('')
}

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];



const COLORS = ["#0088FF", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
      
    </text>
  );
};

const fetchData = (setData, filter,  date) => {
  if (!date) {
    date = new Date().toISOString().split('T')[0];
  }
  api.get(`/stats?filter=${filter}&date=${date}`)
    .then(response => {
      const formattedData = response.data.map(item => ({
        name: item.category__title,
        value: item.total_time
      }));
      console.log(formattedData)
      setData(formattedData)
    })
    .catch(error => {
      console.error(`Error fetching ${filter} stats:`, error);
    });
};







export function PieChartComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(setData, 'weekly')
  }, []);

  return (
        <PieChart width={600} height={600}>
          <Pie
            data= {data}
            cx={400}
            cy={400}
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index, entry}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
  );
}

export default PieChartComponent