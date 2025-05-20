// Define image URLs for agent profile images
const agentImages = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500", // Professional woman in suit
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500", // Smiling man
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500", // Woman with glasses
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500"  // Professional man
];

// Function to get a specific image by index
export function getAgentImageByIndex(index: number): string {
  // Make sure the index is within the array bounds
  const safeIndex = index % agentImages.length;
  return agentImages[safeIndex];
}

// Function to get a random agent image
export function getRandomAgentImage(): string {
  const randomIndex = Math.floor(Math.random() * agentImages.length);
  return agentImages[randomIndex];
}

export default agentImages;
