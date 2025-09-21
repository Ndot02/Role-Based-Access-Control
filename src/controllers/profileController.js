import { AppDataSource } from "../data-source.js";

export const updateProfile = async (ctx) => {
  const userId = ctx.state.user.userId;
  // console.log("ctx.state.user at route:", ctx.state.user);
  // console.log("userId:",userId)
  const { bio, phoneNumber, address, dateOfBirth } = ctx.req.body;
  
  const profileRepo = AppDataSource.getRepository("Profile");

  let profile = await profileRepo.findOne({ where: { user: { id: userId } } });

  if (!profile) profile = profileRepo.create({ user: { id: userId } });

  if (bio) profile.bio = bio;
  if (phoneNumber) profile.phoneNumber = phoneNumber;
  if (address) profile.address = address;
  if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
  if (ctx.file) profile.profilePicture = ctx.file.path;

  await profileRepo.save(profile);
  ctx.body = { success: true, profile };
};

