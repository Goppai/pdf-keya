import path from 'path';

const messages: { [index: string]: { message: any } } = {};

const updateMessages = (req: {
(arg0: string): { message: any };
keys: () => { forEach: (arg0: (key: any) => void) => void };
}) => {
  req.keys().forEach((key) => {
    const name = path.basename(key).split('.')[0];
    messages[name] = req(key);
  });
};

export { updateMessages };

export default messages;
