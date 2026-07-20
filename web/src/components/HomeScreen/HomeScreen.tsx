'use client';

import { useState, useEffect } from 'react';
import { Typography, Stack, TextField,  Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import './home-screen.scss';

export function HomeScreen() {
  const [showLogin, setShowLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Trigger logo animation
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 2000); // Logo fades and slides up after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    
    // Format as (###)-###-####
    if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3)}`;
    } else {
      return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/groups?phone=${encodeURIComponent(phoneNumber)}`);
  };

  return (
    <Stack 
      className="home-screen__container"
      sx={{ 
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Stack 
        className="home-screen"
        spacing={0}
        sx={{ 
          width: '100%', 
          maxWidth: 400, 
          position: 'relative',
          alignitems: 'center',
          justifycontent: 'center'
        }}
      >
        {/* Logo Animation */}
        <motion.div
          className="home-screen__logo"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{
            opacity: showLogin ? 0 : 1,
            y: showLogin ? -200 : 0,
            scale: showLogin ? 0.5 : 1,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
        >
          <Stack
            className="home-screen__logo-placeholder"
            spacing={2}

          >
          <img
            src="logos/main-logo.png"
            alt="Munchers Logo"
            />
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                color: 'var(--color-primary-main)',
                fontWeight: 600 
              }}
            >
              Munchers
            </Typography>
          </Stack>
        </motion.div>

        {/* Phone Number Entry */}
        <motion.div
          className="home-screen__login"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: showLogin ? 1 : 0,
            y: showLogin ? 0 : 50,
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: 'easeOut',
          }}
        >
          <Stack 
            className="home-screen__login-content"
            spacing={3}
            sx={{ width: '100%' }}
          >
            <Stack 
              spacing={1} 
              sx={{ alignItems: 'center' }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  textAlign: 'center'
                }}
              >
                Welcome Back
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center'
                }}
              >
                Enter your phone number to continue
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Phone Number"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(555)-555-5555"
                  className="home-screen__input"
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  className="home-screen__submit-button"
                  disabled={phoneNumber.length < 14}
                  onClick={handleSubmit}
                >
                  Continue
                </Button>
              </Stack>
            </form>

            <Typography 
              variant="caption" 
              sx={{ 
                textAlign: 'center',
                color: 'var(--color-text-secondary)'
              }}
            >
              This is only for login purposes
            </Typography>
          </Stack>
        </motion.div>
      </Stack>
    </Stack>
  );
}
