'use client';

import {
  Container,
  VStack,
  Box,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FadeIn } from '../motion/FadeIn';
import SectionHeading from '../ui/SectionHeading';

export default function Experience() {
  return (
    <Container as="section" id="experience" py={0} maxW="5xl">
      <FadeIn>
        <SectionHeading
          label="Experience"
          title="Roles across product delivery, tooling, and security."
          description="Current and recent work focused on desktop, Android, networking, and computer vision."
        />

        <VStack gap={10} align="start">
          <Box
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="2xl"
            p={6}
            bg="rgba(10, 14, 22, 0.72)"
            boxShadow="0 16px 40px rgba(0, 0, 0, 0.22)"
            w="full"
          >
            <VStack gap={4} align="start">
              <Box h="1px" w="3rem" bgGradient="linear(to-r, accentGreen, accentLight)" />
              <HStack gap={3} wrap="wrap">
                <Text fontSize="lg" fontWeight="700" color="white">
                  Resistine GmbH
                </Text>
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="gray.400">
                  Berlin, Germany
                </Text>
              </HStack>
              <HStack gap={4} wrap="wrap">
                <Text fontSize="sm" color="gray.400">
                  Dec 2025 - Present
                </Text>
              </HStack>
              <Text fontSize="md" color="accentLight" fontStyle="italic">
                Desktop and Android Developer, Network Security
              </Text>
              <Box w="100%" h="1px" bg="whiteAlpha.300" my={2} />
              <VStack align="start" gap={3}>
                <Text color="gray.300">Built and deployed desktop apps for Windows and Linux</Text>
                <Text color="gray.300">Developed Android apps with Kotlin</Text>
                <Text color="gray.300">Worked on network security tasks such as MDM and endpoint protection</Text>
              </VStack>
            </VStack>
          </Box>

          <Box
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="2xl"
            p={6}
            bg="rgba(10, 14, 22, 0.58)"
            boxShadow="0 10px 28px rgba(0, 0, 0, 0.16)"
            w="full"
          >
            <VStack gap={4} align="start">
              <Box h="1px" w="3rem" bgGradient="linear(to-r, accentGreen, accentLight)" />
              <HStack gap={3} wrap="wrap">
                <Text fontSize="lg" fontWeight="700" color="white">
                  IAV GmbH
                </Text>
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="gray.400">
                  Berlin, Germany
                </Text>
              </HStack>
              <HStack gap={4} wrap="wrap">
                <Text fontSize="sm" color="gray.400">
                  Oct 2024 - Nov 2025
                </Text>
              </HStack>
              <Text fontSize="md" color="accentLight" fontStyle="italic">
                iOS, Frontend Developer and Computer Vision
              </Text>
              <Box w="100%" h="1px" bg="whiteAlpha.300" my={2} />
              <VStack align="start" gap={3}>
                <Text color="gray.300">Built computer vision pipelines with YOLO for automotive data</Text>
                <Text color="gray.300">Built dashboards and internal tools with Next.js</Text>
                <Text color="gray.300">Prototyped iOS features in Swift for vision workflows</Text>
                <Text color="gray.300">Improved Python pipelines for faster analysis and processing</Text>
              </VStack>
            </VStack>
          </Box>

        </VStack>
      </FadeIn>
    </Container>
  );
}
