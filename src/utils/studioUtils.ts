
// Utility function to get studio data from localStorage
export const getStudioById = (id: number) => {
  const savedStudios = localStorage.getItem('laundryStudios');
  if (savedStudios) {
    const studios = JSON.parse(savedStudios);
    return studios.find((studio: any) => studio.id === id);
  }
  return null;
};
