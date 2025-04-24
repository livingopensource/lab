  import ollama from 'ollama';
  import { superValidate, message } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { formSchema } from "./schema";
  import type { PageServerLoad, Actions } from "./$types";
  
  // eslint-disable-next-line prefer-const
  let chatHistory: { role: 'user' | 'assistant'; content: string }[] = [];
  
  export const load: PageServerLoad = async () => {
    return {
      form: await superValidate({}, zod(formSchema)),
      chat: chatHistory
    };
  };
  
  export const actions: Actions = {
    default: async (event) => {
      const form = await superValidate(event, zod(formSchema));
  
      if (!form.valid) {
        return message(form, "Message is invalid.");
      }
  
      const userMessage: { role: 'user' | 'assistant'; content: string } = { role: 'user', content: form.data.message };
      chatHistory.push(userMessage);
  
      const response = await ollama.chat({
        model: "los-trainer",
        messages: chatHistory
      });
  
      const botMessage: { role: 'user' | 'assistant'; content: string } = {
        role: 'assistant',
        content: response.message.content
      };
  
      chatHistory.push(botMessage);
  
      return message(form, response.message.content);
    }    
  };
    