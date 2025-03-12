import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useServicesData } from '@/hooks/useServicesData';
import BasicInfoCard from '@/components/studio/details/BasicInfoCard';
import AddressCard from '@/components/studio/details/AddressCard';
import BusinessCard from '@/components/studio/details/BusinessCard';
import StudioSetupCard from '@/components/studio/details/StudioSetupCard';
import ServicesCard from '@/components/studio/details/ServicesCard';
import PaymentCard from '@/components/studio/details/PaymentCard';

interface StudioDetails {
  id: number;
  studioId: string;
  studioName: string;
  ownerName: string;
  contact: string;
  email: string;
  secondaryContact?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude?: string;
    longitude?: string;
  };
  business: {
    registrationNumber: string;
    gstVatNumber: string;
    panNumber: string;
    openingTime: string;
    closingTime: string;
    priceAdjustment: string;
  };
  studio: {
    employees: number;
    dailyCapacity: number;
    specialEquipment: string;
    washCategory: string[];
  };
  payment: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    upiId: string;
    paymentSchedule: string;
  };
  services: number;
  rating: number;
  status: boolean;
  studioServices?: StudioService[];
}

interface StudioService {
  id: string;
  name: string;
  active: boolean;
  price?: number;
}

const StudioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { services, subServices, clothingItems } = useServicesData();
  const [studioDetails, setStudioDetails] = useState<StudioDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudioDetails = () => {
      setLoading(true);
      try {
        const savedStudios = localStorage.getItem('laundryStudios');
        
        if (savedStudios) {
          const studios = JSON.parse(savedStudios);
          const studio = studios.find((s: any) => s.id === Number(id));
          
          if (studio) {
            const studioFullDetails: StudioDetails = {
              ...studio,
              email: "saitejasamala0808@gmail.com",
              secondaryContact: "9000135876",
              address: {
                street: "1-23/45, Main Street",
                city: "Hyderabad",
                state: "Telangana",
                postalCode: "500081",
                latitude: "17.3850",
                longitude: "78.4867"
              },
              business: {
                registrationNumber: "UADJFDFJ4427287",
                gstVatNumber: "GST9876541",
                panNumber: "ABCDE1234F",
                openingTime: "09:00 AM",
                closingTime: "09:00 PM",
                priceAdjustment: "10%"
              },
              studio: {
                employees: 2,
                dailyCapacity: 100,
                specialEquipment: "Special dry cleaning",
                washCategory: ["Standard Wash", "Express Wash"]
              },
              payment: {
                accountHolderName: studio.ownerName,
                bankName: "HDFC",
                accountNumber: "50107846646453",
                ifscCode: "HDFC00236898",
                branchName: "Gachibowli Phase-2",
                upiId: `${studio.ownerName.toLowerCase().replace(/\s+/g, '')}@upi`,
                paymentSchedule: "Daily Payment"
              },
              studioServices: [
                { id: '1', name: 'Dry Cleaning', active: true, price: 150 },
                { id: '2', name: 'Express Wash', active: true, price: 200 },
                { id: '3', name: 'Steam Iron', active: false, price: 100 },
                { id: '4', name: 'Stain Removal', active: true, price: 180 }
              ]
            };
            
            setStudioDetails(studioFullDetails);
          } else {
            toast({
              variant: "destructive",
              title: "Studio not found",
              description: "The requested studio could not be found"
            });
            navigate('/studios');
          }
        } else {
          toast({
            variant: "destructive",
            title: "No studios found",
            description: "No studios are available in the system"
          });
          navigate('/studios');
        }
      } catch (error) {
        console.error('Error fetching studio details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load studio details"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudioDetails();
  }, [id, navigate, toast]);

  const handleServiceStatusChange = (serviceIndex: number) => {
    if (studioDetails?.studioServices) {
      const updatedServices = [...studioDetails.studioServices];
      updatedServices[serviceIndex].active = !updatedServices[serviceIndex].active;
      setStudioDetails({
        ...studioDetails,
        studioServices: updatedServices,
      });
    }
  };

  if (loading) {
    return (
      <Layout activeSection="studios">
        <div className="flex items-center justify-center h-screen">
          <p>Loading studio details...</p>
        </div>
      </Layout>
    );
  }

  if (!studioDetails) {
    return (
      <Layout activeSection="studios">
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-xl">Studio not found</p>
          <Button className="mt-4" onClick={() => navigate('/studios')}>
            Return to Studios
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/studios')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{studioDetails.studioName}</h1>
              <p className="text-gray-600">ID: {studioDetails.studioId}</p>
            </div>
          </div>
          <Button 
            className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
            onClick={() => {
              toast({
                title: "Edit mode",
                description: "Edit functionality to be implemented"
              });
            }}
          >
            <Pencil className="h-4 w-4" />
            Edit Details
          </Button>
        </div>

        <BasicInfoCard
          ownerName={studioDetails.ownerName}
          studioName={studioDetails.studioName}
          email={studioDetails.email}
          contact={studioDetails.contact}
          secondaryContact={studioDetails.secondaryContact}
        />

        <AddressCard {...studioDetails.address} />

        <BusinessCard {...studioDetails.business} />

        <StudioSetupCard {...studioDetails.studio} />

        <ServicesCard
          services={studioDetails.studioServices || []}
          onServiceStatusChange={handleServiceStatusChange}
        />

        <PaymentCard {...studioDetails.payment} />
      </div>
    </Layout>
  );
};

export default StudioDetails;
