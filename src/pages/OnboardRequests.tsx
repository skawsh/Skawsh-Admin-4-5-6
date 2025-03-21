
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RequestsTable } from '@/components/onboard-requests/RequestsTable';
import { FilterDropdown } from '@/components/onboard-requests/FilterDropdown';
import { useOnboardRequests } from '@/hooks/useOnboardRequests';
import { filterOptions, filterDisplayNames } from '@/types/onboard-requests';
import { format } from 'date-fns';

const OnboardRequests: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('pending');
  
  const {
    pendingRequests,
    reviewedRequests,
    timeFilter,
    dateRange,
    expandedFilter,
    handleStatusChange,
    handleFilterChange,
    toggleFilterExpansion,
    setDateRange,
    handleDateRangeSelect
  } = useOnboardRequests();

  return (
    <Layout activeSection="studios">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="bg-white" 
            onClick={() => navigate('/studios')}
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Onboard Requests</h1>
            <p className="text-gray-600 mt-1">Manage studio onboarding requests</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed Requests</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end mt-4">
              <FilterDropdown
                timeFilter={timeFilter}
                filterDisplayNames={filterDisplayNames}
                filterOptions={filterOptions}
                expandedFilter={expandedFilter}
                toggleFilterExpansion={toggleFilterExpansion}
                handleFilterChange={handleFilterChange}
                dateRange={dateRange}
                setDateRange={setDateRange}
                handleDateRangeSelect={handleDateRangeSelect}
              />
            </div>
            
            <TabsContent value="pending" className="mt-4">
              <RequestsTable 
                requests={pendingRequests} 
                onStatusChange={handleStatusChange} 
              />
            </TabsContent>
            
            <TabsContent value="reviewed" className="mt-4">
              <RequestsTable 
                requests={reviewedRequests} 
                onStatusChange={handleStatusChange} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default OnboardRequests;
