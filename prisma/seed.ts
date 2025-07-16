/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  PrismaClient,
  UserRole,
  PostType,
  CrewMemberRole,
  UserStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password', 10);

  // Create users by role
  const userRoles: UserRole[] = [
    UserRole.USER,
    UserRole.INFLUENCER,
    UserRole.BRAND,
    UserRole.MASTER,
  ];

  const users: Record<UserRole, string[]> = {
    [UserRole.USER]: [],
    [UserRole.INFLUENCER]: [],
    [UserRole.BRAND]: [],
    [UserRole.MASTER]: [],
  };

  for (const role of userRoles) {
    for (let i = 1; i <= 3; i++) {
      const user = await prisma.user.create({
        data: {
          email: `${role.toLowerCase()}${i}@example.com`,
          username: `${role.toLowerCase()}${i}`,
          passwordHash,
          role,
          status: UserStatus.ACTIVE,
        },
      });
      users[role].push(user.id);
    }
  }

  // Create crews owned by influencer users
  const crews = [] as { id: string; ownerId: string }[];
  for (let i = 0; i < 3; i++) {
    const ownerId = users[UserRole.INFLUENCER][i];
    const crew = await prisma.crew.create({
      data: {
        name: `Crew ${i + 1}`,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: CrewMemberRole.OWNER,
          },
        },
      },
    });
    crews.push({ id: crew.id, ownerId });
  }

  // Add some additional crew members
  for (const crew of crews) {
    const member1 = users[UserRole.USER].pop();
    const member2 = users[UserRole.BRAND].pop();
    if (member1) {
      await prisma.crewMember.create({
        data: { crewId: crew.id, userId: member1, role: CrewMemberRole.MEMBER },
      });
    }
    if (member2) {
      await prisma.crewMember.create({
        data: {
          crewId: crew.id,
          userId: member2,
          role: CrewMemberRole.MANAGER,
        },
      });
    }
  }

  // Create hashtags
  const hashtagNames = Array.from({ length: 10 }).map((_, i) => `tag${i + 1}`);
  const hashtags = await Promise.all(
    hashtagNames.map((name) => prisma.hashTag.create({ data: { name } })),
  );

  // Helper to pick random item
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Create posts by type
  const postTypes: PostType[] = [PostType.TALK, PostType.COLUMN, PostType.CREW];
  for (const type of postTypes) {
    for (let i = 1; i <= 5; i++) {
      const authorId = pick([
        ...users[UserRole.USER],
        ...users[UserRole.INFLUENCER],
        ...users[UserRole.BRAND],
      ]);
      const crewId = type === PostType.TALK ? undefined : pick(crews).id;

      const tagIds = Array.from({ length: 3 })
        .map(() => pick(hashtags).id)
        .filter((v, idx, arr) => arr.indexOf(v) === idx); // unique

      await prisma.post.create({
        data: {
          type,
          title: `${type} post ${i}`,
          content: { text: `Example content for ${type} post ${i}` },
          authorId,
          ...(crewId && { crewId }),
          hashtags: {
            create: tagIds.map((id) => ({ hashtags: { connect: { id } } })),
          },
        },
      });
    }
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
