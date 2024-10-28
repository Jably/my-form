// src/utils/api.ts
export async function fetchProvinces() {
    const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
    return response.json();
  }
  
  export async function fetchRegencies(provinceId: string) {
    const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
    return response.json();
  }
  
  export async function fetchDistricts(regencyId: string) {
    const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`);
    return response.json();
  }
  
  export async function fetchVillages(districtId: string) {
    const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`);
    return response.json();
  }
  