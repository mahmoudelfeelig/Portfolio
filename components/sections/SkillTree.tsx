'use client';

import {
  Box,
  Text,
  Button,
  Icon,
  Grid,
  VStack,
} from '@chakra-ui/react';
import { Collapse } from '@chakra-ui/transition';
import { Progress } from '@chakra-ui/progress';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';

const skills = [
  {
    skill: 'Full-Stack Development',
    proficiency: 95,
    summary: 'Building web applications with clean architecture and solid performance',
    techStack: {
      React: ['Next.js', 'Framer Motion', 'Chakra UI'],
      JavaScript: ['Node.js', 'Express'],
      CSS: ['Tailwind'],
      HTML: [],
    },
  },
  {
    skill: 'iOS Development',
    proficiency: 90,
    summary: 'Custom iOS applications with a focus on user experience',
    techStack: {
      Swift: ['SwiftUI', 'UIKit'],
    },
  },
  {
    skill: 'Data Analysis & Computer Vision',
    proficiency: 85,
    summary: 'Data analysis and computer vision workflows with YOLO',
    techStack: {
      Python: ['Pandas', 'Matplotlib', 'YOLO', 'NumPy'],
    },
  },
  {
    skill: 'Game Development',
    proficiency: 75,
    summary: 'Game development with Godot and/or Unity',
    techStack: {
      Godot: ['GDScript', 'Godot Physics'],
      Unity: ['C#', 'Unity Physics'],
    },
  },
  {
    skill: 'Network Security',
    proficiency: 80,
    summary: 'Network infrastructure and security',
    techStack: {
      Wireshark: [],
      Linux: ['Ubuntu', 'Kali'],
      Networking: ['TCP/IP', 'OSI Layers', 'DHCP', 'DNS'],
    },
  },
  {
    skill: 'Competitive Programming',
    proficiency: 70,
    summary: 'Problem solving and algorithm design',
    techStack: {
      Java: [],
    },
  },
  {
    skill: 'UI/UX & Animation',
    proficiency: 70,
    summary: 'Motion design & interaction-first UI with a creative eye',
    techStack: {
        Figma: [],
        'Framer Motion': [],
    },
  },
];

export default function SkillTree() {
  const [openSkills, setOpenSkills] = useState<Set<string>>(new Set());
  const [openSubskills, setOpenSubskills] = useState<Set<string>>(new Set());

  const toggleSkill = (skill: string) => {
    const newSet = new Set(openSkills);
    newSet.has(skill) ? newSet.delete(skill) : newSet.add(skill);
    setOpenSkills(newSet);
  };

  const toggleSub = (key: string) => {
    const newSet = new Set(openSubskills);
    newSet.has(key) ? newSet.delete(key) : newSet.add(key);
    setOpenSubskills(newSet);
  };

  return (
    <Box as="section" id="skills" py={0} px={0}>
      <Box maxW="6xl" mx="auto">
        <SectionHeading
          label="Skills"
          title="A practical stack for product, platform, and security work."
          description="The focus is not breadth for its own sake. It is being able to ship the right thing in the right place."
          align="center"
        />
      </Box>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        gap={5}
        maxW="6xl"
        mx="auto"
      >
        {skills.map(({ skill, summary, proficiency, techStack }) => (
          <Box
            key={skill}
            p={5}
            borderRadius="2xl"
            border="1px solid"
            borderColor="whiteAlpha.100"
            bg="rgba(10, 14, 22, 0.7)"
            _hover={{ borderColor: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
            transition="all 0.2s ease"
            boxShadow="0 12px 30px rgba(0, 0, 0, 0.16)"

          >
            <Box h="1px" w="2.5rem" mb={3} bgGradient="linear(to-r, accentGreen, accentLight)" />
            <Button
              variant="ghost"
              onClick={() => toggleSkill(skill)}
              width="100%"
              justifyContent="space-between"
              fontWeight="bold"
              fontSize="lg"
              color="accentLight"
              display="flex"
              alignItems="center"
            >
              <span style={{ flex: 1, textAlign: 'left' }}>{skill}</span>
              <Icon
                as={openSkills.has(skill) ? ChevronDownIcon : ChevronRightIcon}
                ml={2}
                boxSize={4}
              />
            </Button>

            <Collapse in={openSkills.has(skill)} animateOpacity>
              <Text fontSize="sm" mt={3} mb={2} color="gray.400">
                {summary}
              </Text>
              <Progress
                value={proficiency}
                colorScheme="green"
                borderRadius="md"
                size="sm"
                mb={3}
              />
              <VStack align="start" gap={2}>
                {Object.entries(techStack).map(([tech, libs]) => {
                  const key = `${skill}-${tech}`;
                  const isExpandable = libs.length > 0;
                  return (
                    <Box key={key} width="100%">
                      <Button
                        variant="ghost"
                        color="accentGreen"
                        fontWeight="normal"
                        size="sm"
                        justifyContent="start"
                        onClick={isExpandable ? () => toggleSub(key) : undefined}
                        _hover={{ textDecoration: isExpandable ? 'none' : 'default' }}
                        cursor={isExpandable ? 'pointer' : 'default'}
                      >
                        {isExpandable && (
                          <Icon
                            as={
                              openSubskills.has(key)
                                ? ChevronDownIcon
                                : ChevronRightIcon
                            }
                            boxSize={4}
                            mr={2}
                          />
                        )}
                        {tech}
                      </Button>
                      {isExpandable && (
                        <Collapse in={openSubskills.has(key)}>
                          <VStack
                            pl={6}
                            pt={1}
                            align="start"
                            gap={1}
                            fontSize="sm"
                            color="gray.300"
                          >
                            {libs.map((lib: string) => (
                              <Text key={lib}>{lib}</Text>
                            ))}
                          </VStack>
                        </Collapse>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            </Collapse>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
