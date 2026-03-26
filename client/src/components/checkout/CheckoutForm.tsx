const CheckoutForm = () => {
  const inputClass =
    "w-full border border-zinc-300 px-3 py-2 text-[11px] tracking-[0.05em] text-black focus:outline-none focus:border-black transition-colors placeholder:text-zinc-400 uppercase";

  const selectClass =
    "w-full border border-zinc-300 px-3 py-2 text-[11px] tracking-[0.05em] text-black focus:outline-none focus:border-black transition-colors appearance-none bg-white uppercase";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Contact Section */}
      <section>
        <h3 className="text-[12px] font-bold tracking-[0.05em] mb-4">Contact</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <div className="col-span-1">
            <input type="text" placeholder="FIRST NAME" className={inputClass} />
          </div>
          <div className="col-span-1">
            <input type="text" placeholder="LAST NAME" className={inputClass} />
          </div>
          <div className="col-span-2">
            <input type="email" placeholder="EMAIL" className={inputClass} />
          </div>
          <div className="col-span-2">
            <input type="tel" placeholder="PHONE NUMBER" className={inputClass} />
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section>
        <h3 className="text-[12px] font-bold tracking-[0.05em] mb-4">Delivery</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <div className="col-span-2 relative">
            <select className={selectClass}>
              <option value="">SELECT A COUNTRY / REGION...</option>
              <option value="VN">VIETNAM</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="col-span-2 relative">
            <select className={selectClass}>
              <option value="">SELECT A STATE</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="col-span-2">
            <input type="text" placeholder="TOWN/CITY" className={inputClass} />
          </div>
          <div className="col-span-2">
            <input type="text" placeholder="APARTMENT, SUITE, UNIT, ETC." className={inputClass} />
          </div>
          <div className="col-span-1">
            <input type="text" placeholder="ADDRESS" className={inputClass} />
          </div>
          <div className="col-span-1">
            <input type="text" placeholder="POSTCODE / ZIP" className={inputClass} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutForm;
