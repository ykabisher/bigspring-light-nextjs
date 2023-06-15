import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Cta from "@layouts/components/Cta";
import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import "swiper/swiper.min.css";
import { getListPage } from "../lib/contentParser";

const Home = ({ frontmatter }) => {
  const { banner, feature, services, workflow, call_to_action } = frontmatter;
  const { title } = config.site;

  return (
    <Base title={title}>
      {/* Banner */}
      <section className="section pb-[50px]">


        <div className="container">

          <div className="row text-center">
            <div className="mx-auto lg:col-10">
              <h1 className="font-primary font-bold">{banner.title}</h1>
              <p className="mt-4 text-lg">{markdownify(banner.content)}</p>

              {/* <iframe src="https://drive.google.com/file/d/1q4teK3OYBEHYhiow2-HPrI4i0iyxjFs7/preview?start=1" width="852" height="480"></iframe> */}
              {/* <iframe src="https://www.youtube.com/embed/sODG_d5RJXw?autoplay=1" width="852" height="480" frameborder="0" allowfullscreen></iframe> */}
              <video style={{ border: '1px solid' }} autoPlay loop muted defaultmuted className="mt-5 mx-auto max-w-[100%]">
                <source src="https://uigeneration.s3.eu-central-1.amazonaws.com/main-video-fast.mp4" /></video>

              <div className="col-start-1 row-start-4 mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0" style={{ placeContent: 'center' }}>
                <p className="inline-flex justify-center" style={{ display: 'flex', alignItems: 'center' }}>The Figma plug-in is ready!</p>

                <Link
                  className="btn btn-primary"
                  href={'https://www.figma.com/community/plugin/1221144015267698736/'}
                  target="_blank"
                >
                  {'Try it out'}
                </Link>

              </div>

              <div className="mt-4 text-lg">



              </div>
              {/* <Image
                className="mx-auto mt-12"
                src={banner.image}
                width={750}
                height={390}
                alt="banner image"
                priority
              /> */}

            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* <section className="section bg-theme-light">
        <div className="container">
          <div className="text-center">
            <h2>{markdownify(feature.title)}</h2>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {feature.features.map((item, i) => (
              <div
                className="feature-card rounded-xl bg-white p-5 pb-8 text-center"
                key={`feature-${i}`}
              >
                {item.icon && (
                  <Image
                    className="mx-auto"
                    src={item.icon}
                    width={30}
                    height={30}
                    alt=""
                  />
                )}
                <div className="mt-4">
                  {markdownify(item.name, "h3", "h5")}
                  <p className="mt-3">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* services */}
      {services.map((service, index) => {
        const isOdd = index % 2 > 0;
        return (
          <section
            key={`service-${index}`}
            className={`section`}
          >
            <div className="container">
              <div className="items-center gap-8 md:grid md:grid-cols-2">
                {/* Carousel */}

                <div className={`service-carousel ${!isOdd && "md:order-2"}`}>
                  {
                    service?.video ? <video width="320" height="240" autoplay>
                      <source src={service?.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video> : <Image src={service?.images[0]} quality={100} alt="" width={500} height={400} />
                  }


                </div>

                {/* Content */}
                <div
                  className={`service-content mt-5 md:mt-0 ${!isOdd && "md:order-1"
                    }`}
                >
                  <h2 className="font-bold leading-[40px]">{service?.title}</h2>
                  <p className="mt-4 mb-2">{service?.content}</p>
                  {/* {service.button.enable && (
                    <Link
                      href={service?.button.link}
                      className="cta-link inline-flex items-center text-primary"
                    >
                      {service?.button.label}
                      <Image
                        className="ml-1"
                        src="/images/arrow-right.svg"
                        width={18}
                        height={14}
                        alt="arrow"
                      />
                    </Link>
                  )} */}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* workflow */}
      {/* <section className="section pb-0">
        <div className="mb-8 text-center">
          {markdownify(
            workflow.title,
            "h2",
            "mx-auto max-w-[400px] font-bold leading-[44px]"
          )}
          {markdownify(workflow.description, "p", "mt-3")}
        </div>
        <Image
          src={workflow.image}
          alt="workflow image"
          width={1920}
          height={296}
        />
      </section> */}

      {/* Cta */}
      {/* <Cta cta={call_to_action} /> */}
    </Base>
  );
};

export const getStaticProps = async () => {
  const homePage = await getListPage("content/_index.md");
  const { frontmatter } = homePage;
  return {
    props: {
      frontmatter,
    },
  };
};

export default Home;
