import config from "@config/config.json";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ src }) => {
  // destructuring items from config object
  const { base_url, logo, logo_width, logo_height, logo_text, title } =
    config.site;

  return (
    <Link
      href={base_url}
      className="navbar-brand block py-1"
     
    >
      {src || logo ? (
        <div className="flex items-center">
        <Image
          width={logo_width.replace("px", "")}
          height={logo_height.replace("px", "")}
          src={src ? src : logo}
          alt={title}
          priority
          className="mr-3"
        />
        {logo_text}
        </div>
       
        
      ) : logo_text ? (
        logo_text
      ) : (
        title
      )}
    </Link>
  );
};

export default Logo;
