import "module-alias/register";
import runApp from ".";

const init = async () => {
  try {
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();