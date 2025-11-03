package com.example.taskrunner.util;

public class CommandValidator {

    public static boolean isSafe(String command) {
        if (command == null || command.trim().isEmpty()) {
            return false;
        }

        String lowerCommand = command.toLowerCase().trim();

        // Block obviously dangerous commands
        String[] dangerousCommands = {
                "rm ", "del ", "format ", "mkfs", "dd ", "shutdown", "reboot",
                "init ", "> /dev/", "> /proc/", "> /sys/", "> /boot/",
                "wget", "curl", "nc ", "netcat", "ssh ", "scp ", "ftp ",
                "chmod 777", "chown ", "useradd", "adduser", "passwd"
        };

        for (String dangerous : dangerousCommands) {
            if (lowerCommand.contains(dangerous)) {
                return false;
            }
        }

        // Allow common safe patterns for this demo
        String[] allowedPatterns = {
                "echo", "ls", "pwd", "cat ", "date", "whoami", "hostname",
                "sleep", "mkdir ", "touch ", "cd ", "find ", "grep "
        };

        // Check if command contains at least one allowed pattern
        for (String allowed : allowedPatterns) {
            if (lowerCommand.contains(allowed)) {
                return true;
            }
        }

        return false;
    }
}