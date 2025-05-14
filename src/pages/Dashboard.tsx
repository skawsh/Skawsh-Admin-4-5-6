
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useServicesData } from '@/hooks/useServicesData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OrdersSection from '@/components/dashboard/OrdersSection';
import StudiosSection from '@/components/dashboard/StudiosSection';
import ServicesSection from '@/components/dashboard/ServicesSection';

const Dashboard: React.FC = () => {
  const { services, subServices } = useServicesData();
  const [studios, setStudios] = useState<any[]>([]);
  
  useEffect(() => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios) {
      const parsedStudios = JSON.parse(savedStudios);
      setStudios(parsedStudios);
    }
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
