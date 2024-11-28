export enum SocialPlatform {
  Portfolio = 'Portfolio',
  Facebook = 'Facebook',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
  TikTok = 'TikTok',
  Github = 'Github',
  Linkedin = 'Linkedin',
}

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};
