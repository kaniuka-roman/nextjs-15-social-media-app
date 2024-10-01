import { Prisma, PrismaClient } from '@prisma/client'
import { hash } from '@node-rs/argon2'
import { faker } from '@faker-js/faker'
const prisma = new PrismaClient()

const data = Array.from({ length: 25 }).map(() => {
   const sex = faker.person.sexType()
   const firstName = faker.person.firstName(sex)
   const lastName = faker.person.lastName()
   const username = faker.internet.userName({ firstName, lastName })
   const displayName = faker.internet.displayName({ firstName, lastName })
   const email = faker.internet.email({ firstName, lastName, allowSpecialCharacters: true })
   return {
      username,
      email,
      password: '11111111',
      displayName,
   }
})
async function main() {
   await prisma.user.deleteMany({})
   await prisma.post.deleteMany({})
   await prisma.follow.deleteMany({})
   await prisma.session.deleteMany({})
   await prisma.like.deleteMany({})

   const usersArr = data.map(async ({ email, password, username, displayName }) => {
      const passwordHash = await hash(password, {
         memoryCost: 19456,
         timeCost: 2,
         outputLen: 32,
         parallelism: 1,
      })
      return {
         id: faker.string.uuid(),
         username,
         displayName,
         email,
         passwordHash,
      }
   })
   const res = await Promise.all(usersArr)

   const users = await prisma.user.createManyAndReturn({
      data: res,
   })
   const usersIds = users.map((user) => user.id)
   users.forEach(async (user) => {
      await prisma.user.update({
         where: { id: user.id },
         data: {
            bio: faker.person.bio(),
            avatarUrl: faker.image.urlLoremFlickr({ width: 200, height: 200, category: 'profile_photo' }),
            posts: {
               createMany: {
                  data: Array.from({ length: faker.number.int({ min: 10, max: 50 }) }).map(() => ({
                     content: faker.lorem.paragraph({ min: 1, max: 6 }),
                  })),
               },
            },
         },
      })
   })
   usersIds.forEach(async (followerId) => {
      const followings = faker.helpers.arrayElements(
         usersIds.filter((id) => id !== followerId),
         { min: 0, max: users.length }
      )
      await prisma.follow.createMany({
         data: followings.map((followingId) => {
            return {
               followerId,
               followingId,
            }
         }),
      })
   })
}
main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })
