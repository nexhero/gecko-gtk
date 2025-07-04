import Gio from 'gi://Gio'
import GLib from 'gi://GLib'

export function open_default_terminal(env) {
    Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

    let terminal = GLib.getenv("TERMINAL");

    if (terminal) {
        try {
            Gio.Subprocess.new([terminal,'fish','-c',`gecko -a ${env};fish`], Gio.SubprocessFlags.NONE);
        } catch (err) {
            Gio.Subprocess.new(['gnome-terminal','fish','-c',`gecko -a ${env};fish`], Gio.SubprocessFlags.NONE);
        }

        return;
    }
}

export async function removeEnv(envName){
    Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

    try {
        const proc = Gio.Subprocess.new(
            ['fish','-c',`gecko -r ${envName}`],
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE);

        const [stdout, stderr] = await proc.communicate_utf8_async(null,null);
        print("STDOUT:", stdout);
        print("STDERR:", stderr);
        return true
    } catch (e) {
        logError(e);
        return false
    }
}
export async function listEnv(){
    Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

    try {
        const proc = Gio.Subprocess.new(
            ['fish','-c','gecko -l'],
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE);

        const [stdout, stderr] = await proc.communicate_utf8_async(null,null);
        print("STDOUT:", stdout);
        print("STDERR:", stderr);
        const lines = stdout.trim().split('\n')
        return lines
    } catch (e) {
        logError(e);
    }
}
