// Animation variants for component animations
export const fadeInUp = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  export const slideIn = {
    hidden: { 
      x: 20,
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };
  
  export const scaleUp = {
    hidden: { 
      scale: 0.8,
      opacity: 0 
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };