import { useState } from "react";

export default function PrintJobCostCalculator() {
  const [data, setData] = useState({
    printHours: "",
    filamentGrams: "",
    filamentType: "PLA-HS",
    filamentBrand: "eSun",
    depreciationPerHour: "",
    profitMargin: 35,
    monthlyJobs: 20,
    fixedCostUsage: 50,
  });

  const filamentPrices = {
    "PLA-HS": { eSun: 1574, "Bambu Lab": 2600, SunLu: 1560 },
    PETG: { eSun: 1824, "Bambu Lab": 2850, SunLu: 1810 },
    ABS: { eSun: 1824, "Bambu Lab": 2850, SunLu: 1810 },
  };

  const fixedMonthlyCosts = 1300 + 12000 + 6000 + 2000; // Removed staff cost (₹15,000)
  const fixedCostPerPrint = fixedMonthlyCosts / data.monthlyJobs;
  const electricityRate = 5.9; // ₹/kWh
  const printerWattage = 95;
  const packaging = 40;
  const shipping = 150;
  const maintenance = 100;

  const filamentPricePerKg = filamentPrices[data.filamentType]?.[data.filamentBrand] || 0;
  const electricityCost = (data.printHours * printerWattage / 1000) * electricityRate;
  const filamentCost = (data.filamentGrams / 1000) * filamentPricePerKg;
  const depreciationCost = data.depreciationPerHour * data.printHours;
  const adjustedFixedCost = fixedCostPerPrint * (data.fixedCostUsage / 100);

  const coreCost =
    electricityCost +
    filamentCost +
    maintenance +
    parseFloat(depreciationCost || 0) +
    adjustedFixedCost;

  const subtotalWithMargin = coreCost * (1 + data.profitMargin / 100);
  const finalPrice = subtotalWithMargin + packaging + shipping;
  const recommendedPrice = coreCost * 1.3 + packaging + shipping;
  const lossWarning = finalPrice < recommendedPrice;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <img src="/shylp-logo.png" alt="SHYLP Logo" className="w-40 mx-auto" />
      <h1 className="text-3xl font-extrabold text-center text-purple-800">SHYLP Cost Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="font-medium">
          Print Hours:
          <input type="number" className="input w-full mt-1 border rounded px-2 py-1" value={data.printHours} onChange={(e) => setData({ ...data, printHours: e.target.value })} />
        </label>
        <label className="font-medium">
          Filament Used (g):
          <input type="number" className="input w-full mt-1 border rounded px-2 py-1" value={data.filamentGrams} onChange={(e) => setData({ ...data, filamentGrams: e.target.value })} />
        </label>
        <label className="font-medium">
          Filament Type:
          <select className="input w-full mt-1 border rounded px-2 py-1" value={data.filamentType} onChange={(e) => setData({ ...data, filamentType: e.target.value })}>
            <option>PLA-HS</option>
            <option>PETG</option>
            <option>ABS</option>
          </select>
        </label>
        <label className="font-medium">
          Filament Brand:
          <select className="input w-full mt-1 border rounded px-2 py-1" value={data.filamentBrand} onChange={(e) => setData({ ...data, filamentBrand: e.target.value })}>
            <option>eSun</option>
            <option>Bambu Lab</option>
            <option>SunLu</option>
          </select>
        </label>
        <label className="font-medium">
          Depreciation per Hour (₹):
          <input type="number" className="input w-full mt-1 border rounded px-2 py-1" value={data.depreciationPerHour} onChange={(e) => setData({ ...data, depreciationPerHour: e.target.value })} />
        </label>
        <label className="font-medium">
          Profit Margin (%):
          <input type="number" className="input w-full mt-1 border rounded px-2 py-1" value={data.profitMargin} onChange={(e) => setData({ ...data, profitMargin: e.target.value })} />
        </label>
        <label className="font-medium">
          Monthly Print Jobs:
          <input type="number" className="input w-full mt-1 border rounded px-2 py-1" value={data.monthlyJobs} onChange={(e) => setData({ ...data, monthlyJobs: e.target.value })} />
        </label>
        <label className="font-medium">
          % Fixed Cost Used Per Job:
          <input type="number" className="input w-full mt-1 border rounded px-2 py-1" value={data.fixedCostUsage} onChange={(e) => setData({ ...data, fixedCostUsage: e.target.value })} />
        </label>
      </div>

      <div className="mt-6 p-4 rounded-xl shadow bg-purple-50 space-y-2 text-purple-900">
        <div><strong>Electricity Cost:</strong> ₹{electricityCost.toFixed(2)}</div>
        <div><strong>Filament Cost:</strong> ₹{filamentCost.toFixed(2)}</div>
        <div><strong>Depreciation Cost:</strong> ₹{parseFloat(depreciationCost || 0).toFixed(2)}</div>
        <div><strong>Maintenance:</strong> ₹{maintenance.toFixed(2)}</div>
        <div><strong>Fixed Cost Allocated:</strong> ₹{adjustedFixedCost.toFixed(2)}</div>
        <div className="text-xl font-semibold"><strong>Subtotal + Margin (Before Logistics):</strong> ₹{subtotalWithMargin.toFixed(2)}</div>
        <div><strong>Packaging:</strong> ₹{packaging.toFixed(2)}</div>
        <div><strong>Shipping:</strong> ₹{shipping.toFixed(2)}</div>
        <div className="text-xl font-bold text-purple-800"><strong>Final Price:</strong> ₹{finalPrice.toFixed(2)}</div>
        {lossWarning && (
          <div className="text-red-600 font-semibold">⚠️ Warning: This job may be underpriced compared to breakeven + ideal margin.</div>
        )}
      </div>
    </div>
  );
}
