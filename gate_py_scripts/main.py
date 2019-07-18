from gate import Gate;
import sys

args = sys.argv
port = None

if len(args) == 3:
    try:
        port = int(args[1])
    except:
        print('invalid port number')
        sys.exit(0)
        
    relay = Gate(port)
    command = args[2]
    if command.lower() == 'open':
        relay.open()
    elif command.lower() == 'close':
        relay.close()
    elif command.lower() == 'state':
        relay.print_state()
    else:
        print('invalid command; [open, close, state]')
        sys.exit(0)
else:
    print('Please provide proper arguments; e.g. python main.py <port> <command>')