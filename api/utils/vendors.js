// In-memory vendor storage (use database in production)
const vendors = {};
const vendorSales = {};

// Register vendor
function registerVendor(vendorData) {
  const vendorId = vendorData.userId;
  vendors[vendorId] = {
    ...vendorData,
    id: vendorId,
    isActive: true,
  };
  vendorSales[vendorId] = [];
  console.log(`Vendor ${vendorId} registered`);
  return vendors[vendorId];
}

// Get vendor
function getVendor(vendorId) {
  return vendors[vendorId];
}

// Get vendor sales
function getVendorSales(vendorId) {
  return vendorSales[vendorId] || [];
}

// Add sale
function addSale(vendorId, saleData) {
  if (!vendorSales[vendorId]) {
    vendorSales[vendorId] = [];
  }
  const sale = {
    ...saleData,
    id: `SALE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
  };
  vendorSales[vendorId].push(sale);
  console.log(`Sale ${sale.id} added for vendor ${vendorId}`);
  return sale;
}

module.exports = {
  registerVendor,
  getVendor,
  getVendorSales,
  addSale,
};
