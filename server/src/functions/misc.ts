export const sponsorFiles = (
  files: Express.Multer.File[] | undefined,
  rawSponsors: string | string[] | undefined
): { sponsors: Sponsor[]; other_images: string[] } => {
  if (!rawSponsors && !files) return { sponsors: [], other_images: [] };

  const sponsors: Sponsor[] = [];
  const other_images: string[] = [];

  const parsedSponsors = Array.isArray(rawSponsors)
    ? rawSponsors.map((sponsor: any) => JSON.parse(sponsor))
    : ([JSON.parse(rawSponsors ? rawSponsors : "")] as {
        sponsor: string;
        fileName: string;
      }[]);
  files?.forEach((file) => {
    const index = parsedSponsors.findIndex(
      (s) => s.fileName === file.originalname
    );
    if (index > -1) {
      sponsors.push({
        name: parsedSponsors[index].sponsor,
        path: file.filename,
      });
    } else {
      other_images.push(file.filename);
    }
  });

  return { sponsors, other_images };
};

export interface Sponsor {
  name: string;
  path: string;
}
