import os
import sys

import frida

PROTECTION = 'rw-'


def on_message(message, data):
    print("[%s] => %s" % (message, data))


def main(target_process):
    session = frida.attach(target_process)
    with open('_agent.js', 'r') as agent_script:
        contents = agent_script.read()
    script = session.create_script(contents)
    
    script.on('message', on_message)
    if not script:
        print('Could not load _agent.js script.')
        sys.exit(1)
    
    script.on('message', on_message)
    script.load()
    
    try:
        script.exports.dump_process_memory(PROTECTION)
    except frida.InvalidOperationError:
        print('InvalidOperationError: Process is not running anymore.')
    session.detach()


if __name__ == '__main__':
    if not os.path.isfile('_agent.js'):
        print('ERROR: Please build the agent first by running `npm run build`')
        sys.exit(1)
 
    if len(sys.argv) != 2:
        print("Usage: %s <process name or PID> " % __file__)
        sys.exit(1)
    
    try:
        target_process = int(sys.argv[1])
    except ValueError:
        target_process = sys.argv[1]
    
    main(target_process)