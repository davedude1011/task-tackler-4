"use server"

/*
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
*/

function generate_random_number_string(length = 19): string {
  let random_number_string = "";
  for (let i = 0; i < length; i++) {
    random_number_string += Math.floor(Math.random() * 10); // Generate a random digit from 0 to 9
  }
  return random_number_string;
}

export async function upload_image(device_id: string, base64_image: string) {
    try {
      // Decode base64 string to binary data
      const response = await fetch(base64_image);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
  
      // Convert response to a Blob
      const image_blob = await response.blob();
  
      // Create a File object for naming and metadata (optional)
      const image_file = new File([image_blob], "image.jpg", {
        type: image_blob.type,
      });
  
      // Prepare FormData
      const form_data = new FormData();
      form_data.append("file", image_file);
  
      // Upload the file
      const api_response = await fetch(
        `https://api.gauthmath.com/ehi/web_api/material/upload?device_id=${device_id}&aid=369768&device_platform=web&sub_platform=web&_region=gb&app_region=gb&app_name=ehi_overseas&language=en&msToken=KvQC25tkLE3L0pYSR__BVbt0XzUXLXANTXPDFoMKCOpZXEGDk7NKqOmJNU5YTVnOs6gRiKzDYn1fC8cL24F-Gc7oZGKOAqZMGSzFN__qQETJ_j8NdNFUGiofiAROq3fAV_1fJsnKEpxCV8Pez-kJkpF3XMzlsWjs5lf0kZrogfhO`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "agw-js-conv": "str",
            // No need to set content-type; fetch handles it for FormData
          },
          referrer: "https://www.gauthmath.com/",
          body: form_data,
        },
      );
  
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const upload_response = await api_response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return upload_response
    } catch (error) {
      console.error("Upload failed:", error);
    }
}



export async function generate_answer(device_id: string, uri: string, width: string, height: string) {
    try {
        const api_response = await fetch(
            `https://api.gauthmath.com/ehi/question/create_v2?device_id=${device_id}&aid=369768&device_platform=web&sub_platform=web&_region=gb&app_region=gb&app_name=ehi_overseas&language=en&msToken=XT9P4I8WOcGmFBacHdacMondAHZkhEJeanZnoxDGE8qGS-4vFLi5XP3kUEPTreNMpkwV2_MGQavF8Cooni4FVKQgUhSLp40TqPjK4ZW8ZMp7aZK_49gaZEBKaLDxZ329P8NazEMOQZpQydT5QaOr95ypUZuyI_0TgIrKkgEcaGgy`,
            {
                method: "POST",
                headers: {
                accept: "*/*",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "agw-js-conv": "str",
                },
                referrer: "https://www.gauthmath.com/",
                body: `{\"image\":{\"uri\":\"${uri}\",\"width\":${width},\"height\":${height}},\"region\":\"gb\"}`,
            },
        );
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response_data = await api_response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response_data
    } catch (error) {
        console.error("Generation failed:", error);
    }
}

export async function get_answer(device_id: string, question_id: string) {
    const maxAttempts = 20;
    let attempt = 0;

    // Retry loop
    while (attempt < maxAttempts) {
        try {
            console.log(`Attempt ${attempt + 1}: Fetching answer for question_id ${question_id}`);

            const api_response = await fetch(
                `https://api.gauthmath.com/ehi/web_api/solution_detail/get?device_id=${device_id}&aid=369768&device_platform=web&sub_platform=web&_region=gb&app_region=gb&app_name=ehi_overseas&language=en&X-Valid-Requested=true&msToken=N2T9Q2qSSMXjUzudPbINeCamqoTh8kaFn9v3bxRsbLsa6FOdry_oLuVVo6b9YCVVQtdbfu-yz6ZkynHwzIKrIszSvfM7Vgn2icYm4HmqA9JeW0Ljma9FaCnH8aI7Xf8sKvLtOv_lkSyK9QlgJe5XdrtT5lX8-DiQeVPwjZIpwlar`,
                {
                    method: "POST",
                    headers: {
                        accept: "*/*",
                        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                        "agw-js-conv": "str",
                    },
                    referrer: "https://www.gauthmath.com/",
                    body: `{\"SolutionUrl\":\"${question_id}\",\"WebSolutionScene\":4,\"RequestId\":\"${generate_random_number_string(13)}\"}`,
                },
            );

            // Parse the response
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response_data = await api_response.json();

            // Check for valid response data and desired content
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (response_data?.WebSolution?.ContentInfo?.Answer?.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return response_data;
            }

        } catch (error) {
            console.error(`Error on attempt ${attempt + 1}:`, error);
            break; // If an error occurs, stop the loop
        }

        // Wait for 500ms before the next attempt
        await new Promise(resolve => setTimeout(resolve, 500));
        attempt++;
    }

    // If no valid data is found after 20 attempts
    console.error("Failed to get a valid answer after 20 attempts.");
    return null;
}
/*
export async function get_answer_website(question_id: string) {
  console.log(question_id);

  // Launch browser using chrome-aws-lambda's executable path
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath,  // Use the correct executable path for Vercel
    headless: true,  // Headless is required on Vercel
    args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],  // Needed for serverless environments
  });

  const page = await browser.newPage();

  // Navigate to the page
  await page.goto(`https://www.gauthmath.com/search-question?questionID=${question_id}&action=image_search`);

  try {
    // Wait for the element to appear (max 10 seconds)
    await page.waitForSelector('[class^="PCCacheAnswer_answerInfo"]', { timeout: 10000 });

    // Extract the element's HTML
    const elementHtml = await page.$eval('[class^="PCCacheAnswer_answerInfo"]', el => {
      // Create a temporary div and assign the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = el.outerHTML;
      
      // Remove the footer if it exists
      const footerElement = tempDiv.querySelector('[class^="PCCacheAnswer_card-footer"]');
      if (footerElement) {
        footerElement.remove();
      }
    
      return tempDiv.innerHTML;  // Return the cleaned-up HTML
    });

    return elementHtml;
  } catch (error) {
    console.error('Element not found within the timeout', error);
  } finally {
    await browser.close();
  }
}
  */