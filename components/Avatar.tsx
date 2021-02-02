import classNames from 'classnames';
import LogoSVG from '../assets/svgs/logo.svg';

export interface AvatarProps {
  // Size is in the same units as Tailwind units
  size?: 8 | 10 | 12 | 16 | 20;
  initial?: string;
  imageSrc?: string;
  onClick?(): void;
}

export function Avatar(props: AvatarProps) {
  const { size = '8', imageSrc, initial, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={classNames(
        'relative flex justify-center items-center rounded-full cursor-pointer duration-300 bg-opacity-75 hover:bg-opacity-100',
        !imageSrc && 'bg-primary',
        `h-${size} w-${size}`,
      )}
    >
      {imageSrc ? (
        // Custom Avatar Image
        <img
          className="w-full h-full rounded-full border border-primary border-opacity-25 "
          src={imageSrc}
          alt={'Author profile picture'}
        />
      ) : initial?.length ? (
        <div className="flex justify-center items-center w-full h-full font-somatic text-white text-xl">
          {initial[0]}
        </div>
      ) : (
        // Default Oxen Avatar
        <LogoSVG
          className="text-white fill-current"
          style={{ height: '55%', marginTop: '15%' }}
        />
      )}
    </div>
  );
}
