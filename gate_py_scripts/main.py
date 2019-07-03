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
        
    gate = Gate(port)
    command = args[2]
    if command.lower() == 'open':
        gate.open()
    elif command.lower() == 'close':
        gate.close()
    elif command.lower() == 'toggle':
        gate.toggle()
    elif command.lower() == 'state':
        gate.print_state()
    else:
        print('invalid command; [open, close, toggle, state]')
        sys.exit(0)
else:
    print('Please provide proper arguments; e.g. python main.py <port> <command>')