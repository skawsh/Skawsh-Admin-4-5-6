
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useServicesData } from '@/hooks/useServicesData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OrdersSection from '@/components/dashboard/OrdersSection';
import StudiosSection from '@/components/dashboard/StudiosSection';
import DriversSection from '@/components/dashboard/DriversSection';
import ServicesSection from '@/components/dashboard/ServicesSection';

const Dashboard: React.FC = () => {
  const { services, subServices } = useServicesData();
  const [studios, setStudios] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  useEffect(() => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios) {
      const parsedStudios = JSON.parse(savedStudios);
      setStudios(parsedStudios);
    }
    
    setDrivers([
      { id: 1, name: 'John Doe', status: true },
      { id: 2, name: 'Jane Smith', status: true },
      { id: 3, name: 'Bob Johnson', status: true },
      { id: 4, name: 'Alice Brown', status: true },
      { id: 5, name: 'Charlie Wilson', status: true },
      { id: 6, name: 'Diana Lee', status: true },
      { id: 7, name: 'Edward Miller', status: true },
      { id: 8, name: 'Fiona Clark', status: true },
      { id: 9, name: 'George Davis', status: true },
      { id: 10, name: 'Helen Taylor', status: false },
      { id: 11, name: 'Ian Jackson', status: false },
    ]);
  }, []);

  const totalStudios = studios.length;
  const activeStudios = studios.filter(studio => studio.status).length;
  const inactiveStudios = totalStudios - activeStudios;
  
  const totalServices = services.length;
  const activeServices = services.filter(service => service.active).length;
  const inactiveServices = totalServices - activeServices;
  
  const totalSubServices = subServices.length;
  const activeSubServices = subServices.filter(subService => subService.active).length;
  const inactiveSubServices = totalSubServices - activeSubServices;

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(driver => driver.status).length;
  const inactiveDrivers = totalDrivers - activeDrivers;

  return (
    <Layout activeSection="dashboard">
      <div className="space-y-6">
        <DashboardHeader />
        
        <OrdersSection />
        
        <StudiosSection 
          totalStudios={totalStudios}
          activeStudios={activeStudios}
          inactiveStudios={inactiveStudios}
        />
        
        <DriversSection 
          totalDrivers={totalDrivers}
          activeDrivers={activeDrivers}
          inactiveDrivers={inactiveDrivers}
        />
        
        <ServicesSection 
          totalServices={totalServices}
          activeServices={activeServices}
          inactiveServices={inactiveServices}
          totalSubServices={totalSubServices}
          activeSubServices={activeSubServices}
          inactiveSubServices={inactiveSubServices}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
