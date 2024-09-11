import { Footer } from "flowbite-react";
import { BsGithub } from "react-icons/bs";

export default function MyFooter() {
  return (
    <Footer container className="bg-transparent border-t border-black dark:border-white mb-0">
      <Footer.Copyright href="#" by="Mariano Moreno" year={2024} />
      <Footer.Icon href="#" icon={BsGithub} />
    </Footer>
  );
}