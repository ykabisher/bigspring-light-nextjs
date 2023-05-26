import Link from "next/link";
import Cta from "./components/Cta";
import {PaddleLoader} from "../layouts/components/PaddleLoader"
import Button from "./shortcodes/Button";
function Pricing({ data }) {
  const {
    frontmatter: { title, plans, call_to_action, subtitle },
  } = data;
  return (
    <>
    <PaddleLoader/>
      <section className="section pb-0">
        <div className="container">
          <h1 className="text-center font-normal">{title}</h1>
          <p className="text-center mt-4 text-lg">{subtitle}</p>
          {/* <p className="text-center mt-4 text-lg">{'Figma Account: 231243243, Yevgeni Kabisher'}</p> */}
          <div className="section row -mt-10 justify-center md:mt-0">
            {plans.map((plan, index) => (
              <div
                className={`col-12 md:col-4 ${
                  !plan.recommended ? "lg:px-0" : "col-recommended"
                }`}
                key={plan.title + index}
              >
                <div className="card text-center">
                  <h4>{plan.title}</h4>
                  <div className="mt-5">
                    <span className="text-5xl text-dark">${plan.price}</span>
                    <span>/ {plan.type}</span>
                 
                  </div>
                  <div className="mt-5">
                  
                    {plan.disscount&& <span className="inline-block rounded-full bg-green-500/25 px-3 py-1 text-sm  mr-2">{`Save %${plan.disscount}`}</span>}
                  </div>
                  {/* <h5 className="mt-2 font-normal text-text">
                    {plan.subtitle}
                  </h5> */}
                  <ul className="mt-5">
                    {plan.features.map((feature, index) => (
                      <li className="mb-[10px] leading-5" key={index}>
                        {feature}
                      </li>
                    ))}
                  </ul>

                
                  <button type="submit" className="btn btn-primary" onClick={()=>{
                    {/* Paddle.Checkout.open({product:49636}) */}
                   }}> {plan.button.label}</button>
                   
                
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <Cta cta={call_to_action} /> */}
    </>
  );
}

export default Pricing;
