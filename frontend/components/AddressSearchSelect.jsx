import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddressSearchSelect({ 
  id, 
  value, 
  onChange, 
  required = false,
  placeholder = "Search and select an address..."
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // Mock addresses data
  const mockAddresses = [
    { address_id: 1, building_name: "Sunshine Apartments", flat_no: "101", street: "Main Street", zone: "Downtown" },
    { address_id: 2, building_name: "Sunshine Apartments", flat_no: "102", street: "Main Street", zone: "Downtown" },
    { address_id: 3, building_name: "Riverside Complex", flat_no: "201", street: "River Road", zone: "North" },
    { address_id: 4, building_name: "Riverside Complex", flat_no: "202", street: "River Road", zone: "North" },
    { address_id: 5, building_name: "Garden Villas", flat_no: "A1", street: "Garden Lane", zone: "West" },
    { address_id: 6, building_name: "Garden Villas", flat_no: "A2", street: "Garden Lane", zone: "West" },
    { address_id: 7, building_name: "Metro Towers", flat_no: "501", street: "Metro Street", zone: "East" },
    { address_id: 8, building_name: "Metro Towers", flat_no: "502", street: "Metro Street", zone: "East" },
    { address_id: 9, building_name: "Pine Heights", flat_no: "B1", street: "Pine Avenue", zone: "South" },
    { address_id: 10, building_name: "Pine Heights", flat_no: "B2", street: "Pine Avenue", zone: "South" },
  ];

  // Fetch addresses on component mount
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch("http://localhost:8000/api/addresses/all", {
          method: "GET",
          credentials: "include" // if your backend uses cookies/auth
        });
      
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
      
        const data = await response.json();
        console.log("Fetched addresses:", data);
        setAddresses(data);
      
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }
  
    fetchAddresses();
  }, []);


  // Filter addresses based on search term
  const filteredAddresses = addresses.filter(address => 
    address.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.flat_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find the selected address to display its name
  const selectedAddress = addresses.find(addr => addr.address_id === value);

  return (
    <div className="relative">
      <Label htmlFor={id}>Address</Label>
      <div 
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1 cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {selectedAddress ? `${selectedAddress.building_name} - ${selectedAddress.flat_no}` : placeholder}
        </span>
        <span className="ml-2">▼</span>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
          <div className="p-2">
            <Input
              placeholder="Search by building name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredAddresses.length > 0 ? (
              filteredAddresses.map((address) => (
                <div
                  key={address.address_id}
                  className="px-4 py-2 hover:bg-accent cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    onChange(address.address_id);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <div>
                    <div className="font-medium">{address.building_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {address.flat_no}, {address.street}, {address.zone}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {address.address_id}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-muted-foreground text-center">
                No addresses found
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Hidden input to hold the actual value for form submission */}
      <input 
        type="hidden" 
        id={id} 
        value={value || ""} 
        required={required} 
      />
    </div>
  );
}