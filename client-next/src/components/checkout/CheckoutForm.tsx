interface CheckoutFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region: string;
    state: string;
    city: string;
    apartment?: string;
    address: string;
    postcode?: string;
  };
  setFormData: (data: any) => void;
}

const CheckoutForm = ({ formData, setFormData }: CheckoutFormProps) => {
  const inputClass =
    "w-full border border-black px-3 py-2 text-[11px] tracking-[0.05em] text-black focus:outline-none focus:border-black transition-colors placeholder:text-zinc-400 uppercase";

  const selectClass =
    "w-full border border-black px-3 py-2 text-[11px] tracking-[0.05em] text-black focus:outline-none focus:border-black transition-colors appearance-none bg-white uppercase";

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Contact Section */}
      <section>
        <h3 className="text-[12px] font-bold tracking-[0.05em] mb-4">Contact</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <div className="col-span-1">
            <input type="text" placeholder="FIRST NAME" className={inputClass} value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} />
          </div>
          <div className="col-span-1">
            <input type="text" placeholder="LAST NAME" className={inputClass} value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} />
          </div>
          <div className="col-span-2">
            <input type="email" placeholder="EMAIL" className={inputClass} value={formData.email} onChange={e => handleChange('email', e.target.value)} />
          </div>
          <div className="col-span-2">
            <input type="tel" placeholder="PHONE NUMBER" className={inputClass} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section>
        <h3 className="text-[12px] font-bold tracking-[0.05em] mb-4">Delivery</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <div className="col-span-2 relative">
            <select className={selectClass} value={formData.region} onChange={e => handleChange('region', e.target.value)}>
              <option value="">SELECT A COUNTRY / REGION...</option>
              <option value="Vietnam">VIETNAM</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="col-span-2 relative">
            <select className={selectClass} value={formData.state} onChange={e => handleChange('state', e.target.value)}>
              <option value="">SELECT A STATE</option>
              <option value="HN">HANOI</option>
              <option value="HCM">HO CHI MINH CITY</option>
              <option value="DN">DA NANG</option>
              {/* Other states can be loaded dynamically, keep it simple for now */}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="col-span-2">
            <input type="text" placeholder="TOWN/CITY" className={inputClass} value={formData.city} onChange={e => handleChange('city', e.target.value)} />
          </div>
          <div className="col-span-2">
            <input type="text" placeholder="APARTMENT, SUITE, UNIT, ETC." className={inputClass} value={formData.apartment || ""} onChange={e => handleChange('apartment', e.target.value)} />
          </div>
          <div className="col-span-1">
            <input type="text" placeholder="ADDRESS" className={inputClass} value={formData.address} onChange={e => handleChange('address', e.target.value)} />
          </div>
          <div className="col-span-1">
            <input type="text" placeholder="POSTCODE / ZIP" className={inputClass} value={formData.postcode || ""} onChange={e => handleChange('postcode', e.target.value)} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutForm;
