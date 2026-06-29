'use client';

import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Button,
  VStack,
  Link,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { Collapse } from '@chakra-ui/transition';
import { ArrowTopRightOnSquareIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

type ProjectProps = {
  title: string;
  shortDesc: string;
  longDesc: string;
  year: number;
  techStack: string[];
  features: string[];
  domain: string;
  repo?: string;
  defaultOpen?: boolean;
  hideToggle?: boolean;
};

export default function ProjectCard({
  title,
  shortDesc,
  longDesc,
  year,
  techStack,
  features,
  domain,
  repo,
  defaultOpen = false,
  hideToggle = false,
}: ProjectProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box
      borderRadius="2xl"
      bg="rgba(10, 14, 22, 0.72)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      p={6}
      transition="all .2s ease"
      _hover={{ boxShadow: '0 18px 36px rgba(0, 0, 0, 0.22)', borderColor: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
    >
      <Box h="1px" w="3rem" mb={4} bgGradient="linear(to-r, accentGreen, accentLight)" />
      <Flex justify="space-between" align="start" gap={4} mb={2} wrap="wrap">
        <Box>
          <Heading as="h3" size="md" color="white" mb={1}>
            {title}
          </Heading>
          <Text color="gray.400" fontSize="xs" letterSpacing="0.22em" textTransform="uppercase">
            {year}
          </Text>
          <HStack mt={2} gap={2}>
            <Badge colorScheme="cyan">{domain}</Badge>
          </HStack>
        </Box>
        <Flex gap={2} wrap="wrap" justify="end">
          {repo && (
            <Link
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              color="accentGreen"
              fontSize="sm"
              display="inline-flex"
              alignItems="center"
              gap={1}
              _hover={{ textDecoration: 'underline' }}
            >
              GitHub
              <Icon as={ArrowTopRightOnSquareIcon} boxSize={4} />
            </Link>
          )}
          {!hideToggle && (
            <Button
              size="xs"
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'accentGreen' }}
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              {isOpen ? 'Less' : 'More'}
              <Icon
                as={isOpen ? ChevronDownIcon : ChevronRightIcon}
                boxSize={4}
              />
            </Button>
          )}
        </Flex>
      </Flex>

      <Text color="gray.300" fontSize="sm" lineHeight="1.7">
        {shortDesc}
      </Text>

      <Collapse in={isOpen} animateOpacity>
        <VStack align="start" gap={3} mt={4} pt={4} borderTop="1px solid" borderColor="whiteAlpha.100">
          <Text fontSize="sm" color="gray.300">
            {longDesc}
          </Text>
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={1} color="accentGreen">
              Tech Stack
            </Text>
            <VStack align="start" gap={1}>
              {techStack.map(tech => (
                <Text key={tech} fontSize="sm" color="gray.400">{tech}</Text>
              ))}
            </VStack>
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="sm" mt={2} mb={1} color="accentGreen">
              Features
            </Text>
            <VStack align="start" gap={1}>
              {features.map(feature => (
                <Text key={feature} fontSize="sm" color="gray.400">{feature}</Text>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Collapse>
    </Box>
  );
}
