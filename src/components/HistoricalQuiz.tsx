import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/historicalData';
import { QuizQuestion } from '../types/history';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, RotateCcw, Award, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { playArrivalChime, playClickSound } from '../utils/audio';

interface HistoricalQuizProps {
  soundEnabled: boolean;
  onClose?: () => void;
}

export const HistoricalQuiz: React.FC<HistoricalQuizProps> = ({
  soundEnabled,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    if (soundEnabled) playClickSound(true);

    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
      if (soundEnabled) playArrivalChime(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (soundEnabled) playArrivalChime(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="w-full rounded-2xl border border-amber-900/30 bg-[#0c1626] p-5 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Kuis Evaluasi Pemahaman
          </span>
          <h3 className="text-xl font-bold text-white font-serif">
            Uji Pengetahuan: Alur &amp; Alasan Kedatangan Bangsa Asing
          </h3>
        </div>
        {!isCompleted && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-mono font-bold text-amber-300">
            Soal {currentIndex + 1} dari {QUIZ_QUESTIONS.length}
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="mt-5 space-y-5">
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <div className="rounded-xl border border-slate-800 bg-[#09111e] p-5">
            <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed font-serif">
              {currentQ.question}
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isCorrect = idx === currentQ.correctAnswer;
              const isChosen = idx === selectedOption;

              let buttonStyle = 'border-slate-800 bg-[#09111e] hover:border-slate-700 hover:bg-[#0e1828] text-slate-200';

              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle = 'border-emerald-500/80 bg-emerald-950/50 text-emerald-100 ring-1 ring-emerald-500/40';
                } else if (isChosen && !isCorrect) {
                  buttonStyle = 'border-rose-500/80 bg-rose-950/50 text-rose-100 ring-1 ring-rose-500/40';
                } else {
                  buttonStyle = 'border-slate-800 bg-[#070d17] text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition-all ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/40 text-xs font-bold border border-white/10">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isChosen && !isCorrect && (
                    <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when answered */}
          {isAnswered && (
            <div className="rounded-xl border border-amber-500/30 bg-[#0a1424] p-4 text-xs leading-relaxed animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Penjelasan Sejarah:</span>
              </div>
              <p className="text-slate-300 font-serif text-sm">
                {currentQ.explanation}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition"
                >
                  <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Result Card */
        <div className="mt-6 text-center py-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xl">
            <Award className="h-10 w-10" />
          </div>

          <h4 className="mt-4 text-2xl font-black text-white font-serif">
            Kuis Selesai!
          </h4>
          <p className="mt-1 text-sm text-slate-400">
            Skor Akhir Anda:
          </p>

          <div className="my-4 inline-block rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#14233a] to-[#0c1626] px-8 py-4">
            <span className="text-4xl font-black text-amber-300 font-mono">
              {score} / {QUIZ_QUESTIONS.length}
            </span>
            <p className="mt-1 text-xs text-slate-300 font-medium">
              {score === QUIZ_QUESTIONS.length
                ? 'Luar Biasa! Pemahaman Sejarah Sempurna ★★★'
                : score >= 4
                ? 'Bagus Sekali! Anda memahami alur kedatangan bangsa asing dengan baik.'
                : 'Tetap Semangat! Pelajari kembali rute pelayaran dan alasan kedatangan.'}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
