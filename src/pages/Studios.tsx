
import React from 'react';
import Layout from '../components/layout/Layout';
import StudiosSection from '@/components/dashboard/StudiosSection';
import StudioHeader from '@/components/studios/StudioHeader';
import StudioFilters from '@/components/studios/StudioFilters';
import StudioTable from '@/components/studios/StudioTable';
import { useStudios } from '@/hooks/useStudios';

const Studios: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    filteredStudios,
    resetFilters,
    handleStatusToggle,
    handleDeleteStudio,
    totalStudios,
    activeStudios,
    inactiveStudios
  } = useStudios();

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <StudioHeader />

        <StudiosSection 
          totalStudios={totalStudios}
          activeStudios={activeStudios}
          inactiveStudios={inactiveStudios}
        />

        <StudioFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          resetFilters={resetFilters}
        />

        <StudioTable 
          studios={filteredStudios}
          handleStatusToggle={handleStatusToggle}
          onDelete={handleDeleteStudio}
        />
      </div>
    </Layout>
  );
};

export default Studios;
