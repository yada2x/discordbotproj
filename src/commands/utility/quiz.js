const { SlashCommandBuilder } = require('discord.js');
const ffmpeg = require(`ffmpeg-static`);
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Sends you an ear training quiz'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const { default: Tone } = await import('tone');
            const note = randomNote();
            const outputPath = path.join(__dirname, 'temp_quiz.mp3');

            await generateMP3(Tone, note, outputPath);
            await interaction.editReply({
                content: 'What note is this?',
                files: [outputPath],
            });
            fs.unlinkSync(outputPath);
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while creating your quiz.');
        }
    },
};

const generateMP3 = async (Tone, note, outputPath) => {
    // Creat and play note
    const synth = new Tone.Synth();
    await Tone.start()
    const now = Tone.now();

    synth.triggerAttackRelease(note, '1s', now);

    // Record note
    const recorder = new Tone.Recorder();
    synth.connect(recorder);
    await recorder.start();
    await Tone.getTransport.start('+1.5s');

    // Stop recording and save content
    const recording = await recorder.stop();
    const wavBlob = await recording.arrayBuffer();

    const wavPath = path.join(__dirname, 'temp.wav');
    fs.writeFileSync(wavPath, Buffer.from(wavBlob));

    // Convert WAV to MP3
    const command = `"${ffmpeg}" -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${outputPath}"`;
    await new Promise((resolve, reject) => {
        exec(command, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
    fs.unlinkSync(wavPath);
}

const randomNote = () => {
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const octaves = [3, 4, 5];
    const chosenNote = notes[Math.floor(Math.random() * notes.length)];
    const chosenOctave = octaves[Math.floor(Math.random() * octaves.length)];
    return `${chosenNote}${chosenOctave}`;
}
