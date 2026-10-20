package com.daniel.scheduling.calendar;

import com.daniel.scheduling.calendar.config.GoogleCalendarProperties;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class GoogleCalendarTokenCipher {

    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH_BITS = 128;
    private static final String PREFIX = "v1:";

    private final SecretKeySpec key;
    private final SecureRandom secureRandom = new SecureRandom();

    public GoogleCalendarTokenCipher(
            GoogleCalendarProperties properties
    ) {
        byte[] decodedKey;

        try {
            decodedKey = Base64.getDecoder()
                    .decode(properties.getEncryptionKey());
        } catch (IllegalArgumentException | NullPointerException exception) {
            throw new IllegalStateException(
                    "Google Calendar encryption key must be valid Base64"
            );
        }

        if (decodedKey.length != 32) {
            throw new IllegalStateException(
                    "Google Calendar encryption key must contain 32 bytes"
            );
        }

        this.key = new SecretKeySpec(decodedKey, "AES");
    }

    public String encrypt(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Token must not be blank");
        }

        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    key,
                    new GCMParameterSpec(TAG_LENGTH_BITS, iv)
            );

            byte[] encrypted = cipher.doFinal(
                    value.getBytes(StandardCharsets.UTF_8)
            );

            byte[] result = ByteBuffer
                    .allocate(iv.length + encrypted.length)
                    .put(iv)
                    .put(encrypted)
                    .array();

            return PREFIX + Base64.getEncoder().encodeToString(result);
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException(
                    "Could not encrypt Google Calendar token"
            );
        }
    }

    public String decrypt(String value) {
        try {
            if (value == null || !value.startsWith(PREFIX)) {
                throw new IllegalArgumentException();
            }

            byte[] stored = Base64.getDecoder()
                    .decode(value.substring(PREFIX.length()));

            if (stored.length <= IV_LENGTH + TAG_LENGTH_BITS / 8) {
                throw new IllegalArgumentException();
            }

            ByteBuffer buffer = ByteBuffer.wrap(stored);

            byte[] iv = new byte[IV_LENGTH];
            buffer.get(iv);

            byte[] encrypted = new byte[buffer.remaining()];
            buffer.get(encrypted);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(
                    Cipher.DECRYPT_MODE,
                    key,
                    new GCMParameterSpec(TAG_LENGTH_BITS, iv)
            );

            return new String(
                    cipher.doFinal(encrypted),
                    StandardCharsets.UTF_8
            );
        } catch (GeneralSecurityException | IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Could not decrypt Google Calendar token"
            );
        }
    }
}