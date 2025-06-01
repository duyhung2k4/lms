import "module-alias/register";
import runApp from ".";

const init = async () => {
  try {
    // await createCollection();
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();