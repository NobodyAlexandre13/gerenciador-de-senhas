/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors :{

        primary: '#00388d', 
        secondary: '#27AE60',
        btnEdit: '#009999',    
        error: '#EB5757',  
    
        background: '#f0f0f0',      
        card: '#FFFFFF',
        
        textPrimary: '#333333', 
        textSecondary: '#828282',
        
        border: '#E0E0E0',
        icon: '#4F4F4F'
             
      },
      fontFamily: {
        regular: ['Inter_400Regular'],
        medium: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      }
    },
  },
  plugins: [],
}

